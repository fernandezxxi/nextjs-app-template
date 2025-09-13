import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, BarChart3, Users, Star, Shield, Zap, Building } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-gray-900">Customer Review System</h1>
              </div>
            </div>
            <nav className="flex space-x-4">
              <Link href="/customer-review">
                <Button variant="outline">Submit Review</Button>
              </Link>
              <Link href="/customer-review/summary">
                <Button variant="outline">View Summary</Button>
              </Link>
              <Link href="/customer-review/reports">
                <Button variant="outline">Detailed Reports</Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 sm:text-5xl mb-4">
            Welcome to Our Customer Review System
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            We value your feedback! Share your experience with us and help us improve our services.
            Your voice matters and drives our commitment to excellence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/customer-review">
              <Button size="lg" className="w-full sm:w-auto">
                <FileText className="mr-2 h-5 w-5" />
                Submit Your Review
              </Button>
            </Link>
            <Link href="/customer-review/summary">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                <BarChart3 className="mr-2 h-5 w-5" />
                View Analytics
              </Button>
            </Link>
            <Link href="/customer-review/reports">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                <FileText className="mr-2 h-5 w-5" />
                Detailed Reports
              </Button>
            </Link>
            <Link href="/master/locations">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                <Building className="mr-2 h-5 w-5" />
                Manage Locations
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle>Easy Submission</CardTitle>
              <CardDescription>
                Simple and intuitive form with radio buttons and visual elements for quick feedback submission
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle>Comprehensive Analytics</CardTitle>
              <CardDescription>
                Detailed insights with charts, NPS scoring, and trend analysis for better decision making
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Star className="h-6 w-6 text-purple-600" />
              </div>
              <CardTitle>NPS Rating System</CardTitle>
              <CardDescription>
                Industry-standard Net Promoter Score with visual rating scale from 0-10
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-orange-600" />
              </div>
              <CardTitle>Secure & Private</CardTitle>
              <CardDescription>
                Your feedback is handled securely with proper validation and data protection
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-red-600" />
              </div>
              <CardTitle>Real-time Updates</CardTitle>
              <CardDescription>
                Live dashboard updates with the latest feedback and analytics data
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                <FileText className="h-6 w-6 text-teal-600" />
              </div>
              <CardTitle>Evidence Upload</CardTitle>
              <CardDescription>
                Support for file uploads including images, PDFs, and documents as verification
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-16">
          <h3 className="text-2xl font-bold text-center mb-8">System Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">2</div>
              <div className="text-gray-600">Total Reviews Submitted</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">8.0</div>
              <div className="text-gray-600">Average Rating</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">0</div>
              <div className="text-gray-600">Current NPS Score</div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-white rounded-lg shadow-sm p-8">
          <h3 className="text-2xl font-bold mb-4">Ready to Share Your Feedback?</h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Your opinion helps us improve and provide better services. It only takes a few minutes to complete our review form.
          </p>
          <Link href="/customer-review">
            <Button size="lg" className="px-8">
              Start Review Now
              <FileText className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2024 Customer Review System. Built with Next.js and TypeScript.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
