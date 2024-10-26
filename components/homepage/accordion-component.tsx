import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { TITLE_TAILWIND_CLASS } from "@/utils/constants"

export function AccordionComponent() {
    return (
        <div className="flex flex-col w-[70%] lg:w-[50%]">
            <h2 className={`${TITLE_TAILWIND_CLASS} mt-2 font-semibold text-center tracking-tight dark:text-white text-gray-900`}>
                Häufig gestellte Fragen (FAQs)
            </h2>
            <Accordion type="single" collapsible className="w-full mt-2">
                <AccordionItem value="item-1">
                    <AccordionTrigger><span className="font-medium">Sind die Patientendaten auch nach DSGVO sicher?</span></AccordionTrigger>
                    <AccordionContent>
                        <p>Ja, die Patientendaten werden in unsere Datenbanken sicher verschlüsselt.</p>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    )
}
