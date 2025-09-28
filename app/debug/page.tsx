"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function DebugPage() {
  const [response, setResponse] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [userId, setUserId] = useState("a3afbd33-83a4-41a7-b4c2-7ad7391ba4be")
  const [customerId, setCustomerId] = useState("cus_test123")
  const [subscriptionId, setSubscriptionId] = useState("sub_test123")

  const testDatabaseConnection = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/debug/subscription', {
        method: 'GET'
      })
      const data = await res.json()
      setResponse({ type: 'Database Connection Test', data })
    } catch (error) {
      setResponse({ type: 'Database Connection Error', error: error.message })
    }
    setLoading(false)
  }

  const testSubscriptionCreation = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/debug/subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId,
          customerId,
          subscriptionId
        })
      })
      const data = await res.json()
      setResponse({ type: 'Subscription Creation Test', data })
    } catch (error) {
      setResponse({ type: 'Subscription Creation Error', error: error.message })
    }
    setLoading(false)
  }

  const testWebhookSimulation = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/debug/webhook-test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId
        })
      })
      const data = await res.json()
      setResponse({ type: 'Webhook Simulation Test', data })
    } catch (error) {
      setResponse({ type: 'Webhook Simulation Error', error: error.message })
    }
    setLoading(false)
  }

  const clearResponse = () => {
    setResponse(null)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">
          🔍 DOGGIT Debug Tools
        </h1>
        
        {/* Database Connection Test */}
        <Card>
          <CardHeader>
            <CardTitle>Step 1: Database Connection Test</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">
              Test if we can connect to the Supabase database.
            </p>
            <Button 
              onClick={testDatabaseConnection}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {loading ? 'Testing...' : 'Test Database Connection'}
            </Button>
          </CardContent>
        </Card>

        {/* Subscription Creation Test */}
        <Card>
          <CardHeader>
            <CardTitle>Step 2: Manual Subscription Creation Test</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">
              Test if we can manually create a subscription record in the database.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="userId">User ID</Label>
                <Input
                  id="userId"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  placeholder="test-user-123"
                />
              </div>
              <div>
                <Label htmlFor="customerId">Customer ID</Label>
                <Input
                  id="customerId"
                  value={customerId}
                  onChange={(e) => setCustomerId(e.target.value)}
                  placeholder="cus_test123"
                />
              </div>
              <div>
                <Label htmlFor="subscriptionId">Subscription ID</Label>
                <Input
                  id="subscriptionId"
                  value={subscriptionId}
                  onChange={(e) => setSubscriptionId(e.target.value)}
                  placeholder="sub_test123"
                />
              </div>
            </div>
            
            <div className="flex gap-4">
              <Button 
                onClick={testSubscriptionCreation}
                disabled={loading}
                className="bg-green-600 hover:bg-green-700"
              >
                {loading ? 'Testing...' : 'Test Subscription Creation'}
              </Button>
              <Button 
                onClick={testWebhookSimulation}
                disabled={loading}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {loading ? 'Testing...' : 'Simulate Webhook Payment'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <Button 
                onClick={() => window.open('/membership', '_blank')}
                variant="outline"
              >
                🔗 Open Membership Page
              </Button>
              <Button 
                onClick={() => window.open('https://dashboard.stripe.com/test/logs', '_blank')}
                variant="outline"
              >
                📊 Stripe Dashboard (Logs)
              </Button>
              <Button 
                onClick={clearResponse}
                variant="outline"
              >
                🗑️ Clear Results
              </Button>
              <Button 
                onClick={async () => {
                  const res = await fetch('/api/debug/check-subscriptions')
                  const data = await res.json()
                  setResponse({ type: 'Current Subscriptions', data })
                }}
                variant="outline"
              >
                📊 Check Database
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Response Display */}
        {response && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                📋 {response.type}
                {response.data?.success === true && <span className="text-green-600">✅</span>}
                {response.data?.success === false && <span className="text-red-600">❌</span>}
                {response.error && <span className="text-red-600">❌</span>}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-gray-100 p-4 rounded-lg overflow-auto text-sm">
                {JSON.stringify(response, null, 2)}
              </pre>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}