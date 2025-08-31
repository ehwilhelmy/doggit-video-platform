import { NextRequest, NextResponse } from 'next/server'

// HubSpot API configuration
const HUBSPOT_API_KEY = process.env.HUBSPOT_API_KEY
const HUBSPOT_BASE_URL = 'https://api.hubapi.com'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, firstName, lastName, dogBreed } = body

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    if (!HUBSPOT_API_KEY) {
      console.error('HubSpot API key not configured')
      // Don't expose this error to the client
      return NextResponse.json(
        { success: true, message: 'Contact saved' },
        { status: 200 }
      )
    }

    // Create or update contact in HubSpot
    const hubspotData = {
      properties: {
        email: email,
        firstname: firstName || '',
        lastname: lastName || '',
        // Custom properties - these need to be created in HubSpot first
        contact_type: 'Training Subscriber',
        dog_breed: dogBreed || '',
        lifecyclestage: 'subscriber',
        // Add source information
        hs_lead_status: 'NEW',
        source: 'Training Platform Signup'
      }
    }

    // First, try to create the contact
    const createResponse = await fetch(
      `${HUBSPOT_BASE_URL}/crm/v3/objects/contacts`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${HUBSPOT_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(hubspotData),
      }
    )

    if (!createResponse.ok) {
      const errorData = await createResponse.json()
      
      // If contact exists, update it instead
      if (errorData.category === 'CONFLICT' || errorData.message?.includes('already exists')) {
        // Search for existing contact by email
        const searchResponse = await fetch(
          `${HUBSPOT_BASE_URL}/crm/v3/objects/contacts/search`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${HUBSPOT_API_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              filterGroups: [{
                filters: [{
                  propertyName: 'email',
                  operator: 'EQ',
                  value: email
                }]
              }]
            }),
          }
        )

        if (searchResponse.ok) {
          const searchData = await searchResponse.json()
          if (searchData.results && searchData.results.length > 0) {
            const contactId = searchData.results[0].id
            
            // Update existing contact
            const updateResponse = await fetch(
              `${HUBSPOT_BASE_URL}/crm/v3/objects/contacts/${contactId}`,
              {
                method: 'PATCH',
                headers: {
                  'Authorization': `Bearer ${HUBSPOT_API_KEY}`,
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(hubspotData),
              }
            )

            if (updateResponse.ok) {
              return NextResponse.json(
                { success: true, message: 'Contact updated in HubSpot' },
                { status: 200 }
              )
            }
          }
        }
      }
      
      console.error('HubSpot API error:', errorData)
      // Don't fail the signup if HubSpot fails
      return NextResponse.json(
        { success: true, message: 'Contact saved' },
        { status: 200 }
      )
    }

    return NextResponse.json(
      { success: true, message: 'Contact created in HubSpot' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error creating HubSpot contact:', error)
    // Don't fail the signup if HubSpot fails
    return NextResponse.json(
      { success: true, message: 'Contact saved' },
      { status: 200 }
    )
  }
}