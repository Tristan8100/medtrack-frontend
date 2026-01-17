'use client'
import { useState } from 'react'
import { ChevronDown, Calendar, Clock, FileText, Pill, Phone, MapPin } from 'lucide-react'

export default function FAQSection() {
    const [openItem, setOpenItem] = useState(null)

    const faqItems = [
        {
            id: 'item-1',
            icon: Calendar,
            question: 'Do I need to book an appointment?',
            answer: 'Walk-ins are welcome, but booking ahead saves you time. You can schedule online or call us. For prenatal care and family planning, we recommend booking in advance.'
        },
        {
            id: 'item-2',
            icon: FileText,
            question: 'What documents should I bring?',
            answer: 'Bring a valid ID and your health record booklet if you have one. For first visits, we\'ll create a new record for you. If you\'re continuing treatment from another facility, bring any medical documents or prescriptions.'
        },
        {
            id: 'item-3',
            icon: Clock,
            question: 'How long does a check-up take?',
            answer: 'General consultations usually take 15-30 minutes. If you need lab work or additional screening, plan for about an hour. Booking an appointment helps reduce wait time significantly.'
        },
        {
            id: 'item-4',
            icon: Pill,
            question: 'Are medicines free at the RHU?',
            answer: 'Yes, we provide free essential medicines as part of our community health program. This includes maintenance medicines for chronic conditions like hypertension and diabetes, as well as basic antibiotics and vitamins.'
        },
        {
            id: 'item-5',
            icon: Phone,
            question: 'Can I reschedule my appointment?',
            answer: 'Absolutely. Call us or use the online system to reschedule at least 24 hours before your appointment. This helps us accommodate other patients who might need that time slot.'
        },
        {
            id: 'item-6',
            icon: MapPin,
            question: 'Where is the clinic located?',
            answer: 'We\'re located at the Barangay Health Center. Look for the building with the DOH signage. Parking is available in front, and the entrance is wheelchair accessible.'
        }
    ]

    const toggleItem = (id : any) => {
        setOpenItem(openItem === id ? null : id)
    }

    return (
        <section id="faq" className="bg-gray-50 dark:bg-gray-900 py-20">
            <div className="mx-auto max-w-5xl px-4 md:px-6">
                <div className="flex flex-col gap-10 md:flex-row md:gap-16">
                    <div className="md:w-1/3">
                        <div className="md:sticky md:top-20">
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                                Common Questions
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 mt-4 leading-relaxed">
                                Need more help? Call our hotline or visit us during clinic hours. We're here to assist you.
                            </p>
                            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/40 rounded-lg border border-blue-200 dark:border-blue-800">
                                <p className="text-sm font-semibold text-blue-900 dark:text-blue-200 mb-2">
                                    Emergency Hotline
                                </p>
                                <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                                    (045) 123-4567
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="md:w-2/3">
                        <div className="space-y-3">
                            {faqItems.map((item) => {
                                const Icon = item.icon
                                const isOpen = openItem === item.id
                                
                                return (
                                    <div
                                        key={item.id}
                                        className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden"
                                    >
                                        <button
                                            onClick={() => toggleItem(item.id)}
                                            className="w-full px-6 py-5 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="flex-shrink-0 w-10 h-10 bg-blue-100 dark:bg-blue-900/40 rounded-lg flex items-center justify-center">
                                                    <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                                </div>
                                                <span className="text-left font-medium text-gray-900 dark:text-white">
                                                    {item.question}
                                                </span>
                                            </div>
                                            <ChevronDown 
                                                className={`w-5 h-5 text-gray-500 dark:text-gray-400 transition-transform flex-shrink-0 ml-4 ${
                                                    isOpen ? 'transform rotate-180' : ''
                                                }`}
                                            />
                                        </button>
                                        <div
                                            className={`transition-all duration-300 ease-in-out ${
                                                isOpen 
                                                    ? 'max-h-96 opacity-100' 
                                                    : 'max-h-0 opacity-0 overflow-hidden'
                                            }`}
                                        >
                                            <div className="px-6 pb-5 pl-[4.5rem]">
                                                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                                    {item.answer}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>

                        <div className="mt-8 p-6 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg text-white">
                            <h3 className="text-xl font-semibold mb-2">
                                Still have questions?
                            </h3>
                            <p className="mb-4 opacity-90">
                                Visit us at the clinic or send us a message. Our staff is ready to help.
                            </p>
                            <div className="flex flex-wrap gap-3">
                                <a 
                                    href="#" 
                                    className="px-4 py-2 bg-white text-blue-600 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                                >
                                    Book Appointment
                                </a>
                                <a 
                                    href="#" 
                                    className="px-4 py-2 bg-blue-700 rounded-lg font-medium hover:bg-blue-800 transition-colors"
                                >
                                    Contact Us
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}