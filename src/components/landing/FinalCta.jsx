import Button from '../Button';

export default function FinalCta() {
  return (
    <section className="mx-auto max-w-[1280px] px-5 sm:px-8">
      <div className="on-dark relative overflow-hidden rounded-[36px] bg-wine px-6 py-20 text-center text-cream grain sm:px-12 sm:py-28">
        <div aria-hidden="true" className="absolute left-1/2 top-1/2 h-[120%] w-[78%] -translate-x-1/2 -translate-y-1/2 rounded-[50%] border border-gold/25" />
        <div aria-hidden="true" className="absolute left-1/2 top-1/2 h-[84%] w-[52%] -translate-x-1/2 -translate-y-1/2 rounded-[50%] border border-cream/10" />
        <div className="relative">
          <h2 className="mx-auto max-w-3xl text-[clamp(2.2rem,5vw,4.2rem)] font-medium leading-[1.04]">
            Ready to bring everyone’s photos together?
          </h2>
          <div className="mt-10">
            <Button to="/events/new" variant="light" size="lg">
              Create Your Event
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
