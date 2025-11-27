import posthog from 'posthog-js'
import { withUtm } from '../utils/utm'

export function Testimonials() {
    const testimonials = [
        {
            quote:
                'We recaptured $62K in refund risk the first month. The dashboard surfaced one mislabeled SKU that explained 41% of our returns.',
            author: 'Riya Patel',
            role: 'COO, Oak & Ember Apparel',
        },
    ]

    return (
        <section id="stories" className="testimonials">
            {testimonials.map((story) => (
                <blockquote key={story.author}>
                    <p>“{story.quote}”</p>
                    <cite>
                        {story.author} · {story.role}
                    </cite>
                </blockquote>
            ))}
            <div className="testimonial-cta">
                <h3>Your next refund could be revenue.</h3>
                <p>Ship ReturnShield today and be the success story we feature next week.</p>
                <a
                    className="btn btn-secondary btn-prominent"
                    href={withUtm('https://app.returnshield.app/register', 'testimonial_walkthrough')}
                    onClick={() => posthog.capture('cta_click', { cta: 'schedule_walkthrough' })}
                >
                    Schedule 15-minute walkthrough
                </a>
            </div>
        </section>
    )
}
