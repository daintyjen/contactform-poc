'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

declare global {
  interface Window {
    d365mktformcapture: {
      waitForElement: (selector: string) => Promise<HTMLFormElement>
      serializeForm: (form: HTMLFormElement, mappings: any[]) => any
      submitForm: (config: any, payload: any) => void
    }
  }
}

export default function NewsletterForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [scriptLoaded, setScriptLoaded] = useState(false)

  useEffect(() => {
    // Load the Microsoft Dynamics 365 Marketing script
    const script = document.createElement('script')
    script.src = 'https://cxppusa1formui01cdnsa01-endpoint.azureedge.net/usa/FormCapture/FormCapture.bundle.js'
    script.async = true
    script.onload = () => {
      setScriptLoaded(true)
      initializeFormCapture()
    }
    document.head.appendChild(script)

    return () => {
      // Cleanup script on unmount
      if (document.head.contains(script)) {
        document.head.removeChild(script)
      }
    }
  }, [])

  const initializeFormCapture = () => {
    if (typeof window !== 'undefined' && window.d365mktformcapture) {
      // NOTE: for reference see https://go.microsoft.com/fwlink/?linkid=2250770
      window.d365mktformcapture.waitForElement("#newsletterForm")
        .then(form => {
          const mappings = [
            {
              FormFieldName: "firstName",
              DataverseFieldName: "firstname",
            },
            {
              FormFieldName: "lastName", 
              DataverseFieldName: "lastname",
            },
            {
              FormFieldName: "email",
              DataverseFieldName: "emailaddress1",
            },
            {
                //FormFieldName: "***Please fill***",
                DataverseFieldName: "a1a_constituenttype",
                DataverseFieldValue: "['740490000']",
                    //{ FormValue: "***Please fill***", DataverseValue: "740490000" }, // Sample 1
                    //{ FormValue: "***Please fill***", DataverseValue: "740490001" }, // Sample 2
          
            },
            // {
            //   FormFieldName: "newsletter",
            //   DataverseFieldName: "msdynmkt_topicid;channels;optinwhenchecked",
            //   DataverseFieldValue: "fda62239-dc70-f011-bec2-000d3a11bb02;Email;true",
            // },
            {
                //FormFieldName: "newsletter[]",
                //DataverseFieldName: "msdynmkt_purposeid;channels;optinwhenchecked",
                //DataverseFieldValue: "10000000-0000-0000-0000-000000000003;Email;true",
              DataverseFieldName: "consentsubmissionvalues",
              DataverseFieldValue: "{\"msdynmkt_purposeid\":\"10000000-0000-0000-0000-000000000003\", \"msdynmkt_topicid\":\"fda62239-dc70-f011-bec2-000d3a11bb02\", \"msdynmkt_consenttypevalue\":null, \"channels\":\"Email\", \"optinwhenchecked\":\"true\", \"msdynmkt_value\":\"Opted In\", \"labelText\":\"I agree to subscribe\", \"msdynmkt_compliancesettings4id\":\"7f4a6355-1811-4cde-bde3-fee8c85f56b1\"}",
            },
          ]
          
          form.addEventListener("submit", (e) => {
            const serializedForm = window.d365mktformcapture.serializeForm(form, mappings)
            console.log(JSON.stringify(serializedForm)); // NOTE: enable for debugging
            const payload = serializedForm.SerializedForm.build()
            const captureConfig = {
              FormId: "753ede66-db70-f011-bec2-000d3a11bb02",
              FormApiUrl: "https://public-usa.mkt.dynamics.com/api/v1.0/orgs/7b97bdf6-ba6f-f011-8587-00224820bd18/landingpageforms"
            }
            window.d365mktformcapture.submitForm(captureConfig, payload)
          }, true)
        })
        .catch(error => {
          console.error('Error initializing form capture:', error)
        })
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    // Add a small delay to show loading state
    setTimeout(() => {
      setIsLoading(false)
      setIsSubmitted(true)
    }, 1000)
  }

  if (isSubmitted) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Thank You!</h2>
            <p className="text-gray-600">
              Your subscription has been successfully submitted. You'll start receiving our newsletter soon!
            </p>
            <Button 
              onClick={() => setIsSubmitted(false)}
              variant="outline"
              className="mt-4"
            >
              Subscribe Another Email
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-gray-900">
          Newsletter Signup
        </CardTitle>
        <p className="text-gray-600 mt-2">
          Stay updated with our latest news and updates
        </p>
      </CardHeader>
      <CardContent>
        <form id="newsletterForm" onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
              First Name <span className="text-red-500">*</span>
            </Label>
            <Input
              type="text"
              id="firstName"
              name="firstName"
              required
              placeholder="Enter your first name"
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
              Last Name <span className="text-red-500">*</span>
            </Label>
            <Input
              type="text"
              id="lastName"
              name="lastName"
              required
              placeholder="Enter your last name"
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-gray-700">
              Email Address <span className="text-red-500">*</span>
            </Label>
            <Input
              type="email"
              id="email"
              name="email"
              required
              placeholder="Enter your email address"
              className="w-full"
            />
          </div>

          <div className="flex items-start space-x-3 pt-2">
            <Checkbox 
              id="newsletter" 
              name="newsletter"
              className="mt-1"
            />
            <Label 
              htmlFor="newsletter" 
              className="text-sm text-gray-600 leading-relaxed cursor-pointer"
            >
              I would like to subscribe to the newsletter and receive updates about new content, promotions, and company news.
            </Label>
          </div>

          <Button 
            type="submit" 
            className="w-full mt-6"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Subscribing...
              </>
            ) : (
              'Subscribe Now'
            )}
          </Button>
        </form>

        {!scriptLoaded && (
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">Loading form integration...</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
