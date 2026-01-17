import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Stethoscope, Baby, Syringe, HeartPulse, Pill, Users, ClipboardList, Activity } from 'lucide-react'

export default function ServicesSection() {
    const services = [
        {
            icon: Stethoscope,
            title: "General Consultation",
            description: "Routine health check-ups and medical consultations with our healthcare professionals.",
            color: "blue",
            bgGradient: "from-blue-50 to-blue-100 dark:from-blue-950/40 dark:to-blue-900/40"
        },
        {
            icon: Baby,
            title: "Prenatal & Maternal Care",
            description: "Comprehensive care for expecting mothers including prenatal check-ups and guidance.",
            color: "pink",
            bgGradient: "from-pink-50 to-pink-100 dark:from-pink-950/40 dark:to-pink-900/40"
        },
        {
            icon: Syringe,
            title: "Immunization Services",
            description: "Vaccinations for infants, children, and adults following DOH immunization schedules.",
            color: "emerald",
            bgGradient: "from-emerald-50 to-emerald-100 dark:from-emerald-950/40 dark:to-emerald-900/40"
        },
        {
            icon: HeartPulse,
            title: "Chronic Disease Management",
            description: "Monitoring and treatment for hypertension, diabetes, and other chronic conditions.",
            color: "red",
            bgGradient: "from-red-50 to-red-100 dark:from-red-950/40 dark:to-red-900/40"
        },
        {
            icon: Pill,
            title: "Medicine Dispensing",
            description: "Free essential medicines and supplements as part of our community health program.",
            color: "purple",
            bgGradient: "from-purple-50 to-purple-100 dark:from-purple-950/40 dark:to-purple-900/40"
        },
        {
            icon: Users,
            title: "Family Planning",
            description: "Counseling and services for responsible parenthood and family planning methods.",
            color: "indigo",
            bgGradient: "from-indigo-50 to-indigo-100 dark:from-indigo-950/40 dark:to-indigo-900/40"
        },
        {
            icon: ClipboardList,
            title: "Medical Certificates",
            description: "Issuance of health certificates, medical clearances, and other health documents.",
            color: "amber",
            bgGradient: "from-amber-50 to-amber-100 dark:from-amber-950/40 dark:to-amber-900/40"
        },
        {
            icon: Activity,
            title: "Health Screening",
            description: "Regular health screenings including blood pressure, blood sugar, and BMI monitoring.",
            color: "teal",
            bgGradient: "from-teal-50 to-teal-100 dark:from-teal-950/40 dark:to-teal-900/40"
        }
    ]

    const colors = {
        blue: "text-blue-600 dark:text-blue-400",
        pink: "text-pink-600 dark:text-pink-400",
        emerald: "text-emerald-600 dark:text-emerald-400",
        red: "text-red-600 dark:text-red-400",
        purple: "text-purple-600 dark:text-purple-400",
        indigo: "text-indigo-600 dark:text-indigo-400",
        amber: "text-amber-600 dark:text-amber-400",
        teal: "text-teal-600 dark:text-teal-400",
        } as const;

        type ColorKey = keyof typeof colors;

        const getIconColor = (color: ColorKey) => {
        return colors[color];
        };


    return (
        <section id="services" className="py-16 md:py-32">
            <div className="mx-auto max-w-7xl px-6">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                        Our Services
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Comprehensive healthcare services for the community. Schedule your appointment today.
                    </p>
                </div>

                {/* Services Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {services.map((service, index) => {
                        const Icon = service.icon
                        return (
                            <Card 
                                key={index}
                                className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-2"
                            >
                                <CardContent className="pt-6">
                                    <div className={`bg-gradient-to-br ${service.bgGradient} rounded-xl p-6 mb-4 transition-transform group-hover:scale-105`}>
                                        <Icon 
                                            className={`size-12 ${getIconColor(service.color as ColorKey)}`}
                                            strokeWidth={1.5}
                                        />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                        {service.title}
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                        {service.description}
                                    </p>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>

                {/* Additional Info */}
                <div className="mt-16 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 rounded-2xl p-8 md:p-12">
                    <div className="grid md:grid-cols-2 gap-8 items-center">
                        <div>
                            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                                Walk-in or Book Ahead
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-6">
                                You can visit our clinic during operating hours for walk-in consultations, or book an appointment online to skip the queue and ensure availability.
                            </p>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="flex-shrink-0 w-10 h-10 bg-blue-600 dark:bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                                        1
                                    </div>
                                    <p className="text-gray-700 dark:text-gray-300">Select your preferred service and time slot</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="flex-shrink-0 w-10 h-10 bg-blue-600 dark:bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                                        2
                                    </div>
                                    <p className="text-gray-700 dark:text-gray-300">Receive confirmation and reminders</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="flex-shrink-0 w-10 h-10 bg-blue-600 dark:bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                                        3
                                    </div>
                                    <p className="text-gray-700 dark:text-gray-300">Visit our clinic at your scheduled time</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg">
                            <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                                Operating Hours
                            </h4>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center pb-3 border-b dark:border-gray-700">
                                    <span className="text-gray-600 dark:text-gray-400">Monday - Friday</span>
                                    <span className="font-semibold text-gray-900 dark:text-white">8:00 AM - 5:00 PM</span>
                                </div>
                                <div className="flex justify-between items-center pb-3 border-b dark:border-gray-700">
                                    <span className="text-gray-600 dark:text-gray-400">Saturday</span>
                                    <span className="font-semibold text-gray-900 dark:text-white">8:00 AM - 12:00 PM</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600 dark:text-gray-400">Sunday & Holidays</span>
                                    <span className="font-semibold text-red-600 dark:text-red-400">Closed</span>
                                </div>
                            </div>
                            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/40 rounded-lg">
                                <p className="text-sm text-blue-900 dark:text-blue-200">
                                    <strong>Emergency cases</strong> are accepted 24/7. Please call our hotline for immediate assistance.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}