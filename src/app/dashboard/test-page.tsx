"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function TestDashboard() {
  return (
    <div className="min-h-screen bg-background p-6">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-green-600">✅ Dashboard Test Page</CardTitle>
          <CardDescription>
            If you can see this page, the dashboard routing is working correctly!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800 font-medium">Test Status: PASSED</p>
            <p className="text-green-700">The dashboard page is loading and rendering content.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Test Component 1</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">This is a test card</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Test Component 2</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">This is another test card</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Test Component 3</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">This is the third test card</p>
              </CardContent>
            </Card>
          </div>
          
          <div className="flex justify-center space-x-4 pt-4">
            <Button variant="outline">Test Button 1</Button>
            <Button>Test Button 2</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}