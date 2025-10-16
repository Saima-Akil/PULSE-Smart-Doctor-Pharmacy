import React from 'react'
import { assets } from '../assets/assets'

const WhyChooseUs = () => {
  const features = [
    {
    
      title: 'Qualified Doctors',
      description: 'Licensed healthcare professionals with years of experience in their respective fields.'
    },
    {
      icon: '⏰',
      title: '24/7 Services',
      description: 'Round-the-clock medical assistance and emergency support whenever you need it.'
    },
    {
      icon: '💊',
      title: 'Medicine Delivery',
      description: 'Fast and reliable doorstep prescription delivery service across all major cities.'
    },
    {
      icon: '📱',
      title: 'Easy Booking',
      description: 'Simple and intuitive appointment scheduling system with instant confirmation.'
    },
    {
      icon: '💳',
      title: 'Affordable Pricing',
      description: 'Transparent pricing with no hidden charges and insurance coverage options.'
    },
    {
      icon: '🔒',
      title: 'Secure & Private',
      description: 'Your health data is protected with bank-level security and HIPAA compliance.'
    }
  ]

  return (
    <section className="py-16 px-4 bg-transparent">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Why Choose <span className="text-blue-600">PULSE</span>?
          </h2>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            We&apos;re revolutionizing healthcare access through innovative technology, 
            making quality medical care accessible, affordable, and available 24/7 for everyone.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          <div className="order-2 lg:order-1">
            <div className="relative">
            
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                {assets?.doctor ? (
                  <img 
                    src={assets.doctor} 
                    alt=""
                    className="w-full h-[500px] object-cover"
                  />
                ) : (
                  
                  <div className="w-full h-[500px] bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-6xl mb-4">👨‍⚕️👩‍⚕️</div>
                      <div className="text-gray-700 font-medium">Professional Healthcare Team</div>
                    </div>
                  </div>
                )}
              
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/30 via-transparent to-transparent"></div>
              </div>
              

            </div>
          </div>

          <div className="order-1 lg:order-2">
            <div className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {features.map((feature, index) => (
                  <div 
                    key={index}
                    className="group p-4 rounded-xl hover:bg-blue-50 transition-all duration-300 border border-transparent hover:border-blue-100"
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                          {feature.title}
                        </h4>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              </div>
              </div>
              </div>

      </div>
    </section>
  )
}

export default WhyChooseUs
