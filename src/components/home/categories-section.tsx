import Link from "next/link";

import { CategoryCardImage } from "./category-card-image";

interface CategoryDefinition {
  name: string;
  badge: string;
  description: string;
  fallbackImage: string;
}

const CATEGORIES: CategoryDefinition[] = [
  {
    name: "Photography & Videography",
    badge: "Cinematic Capture",
    description:
      "Timeless editorial storytelling, drone films & candid moments",
    fallbackImage: "/images/categories/photography.jpg",
  },
  {
    name: "Wedding Venues",
    badge: "Curated Spaces",
    description: "Historic estates, garden conservatories & luxury ballrooms",
    fallbackImage: "/images/categories/venues.jpg",
  },
  {
    name: "Decoration & Florist",
    badge: "Botanical Artistry",
    description:
      "Bespoke floral arches, candlelit tablescapes & dreamy styling",
    fallbackImage: "/images/categories/decoration.jpg",
  },
  {
    name: "Catering Services",
    badge: "Culinary Excellence",
    description: "Chef-crafted tasting menus, patisserie & craft beverage bars",
    fallbackImage: "/images/categories/catering.jpg",
  },
  {
    name: "Makeup & Styling",
    badge: "Bridal Glamour",
    description:
      "Radiant bridal beauty, hair artistry & on-site touch-up teams",
    fallbackImage: "/images/categories/makeup.jpg",
  },
  {
    name: "Wedding Fashion",
    badge: "Atelier Couture",
    description: "Couture bridal gowns, bespoke tuxedos & heirloom accessories",
    fallbackImage: "/images/categories/fashion.jpg",
  },
];

export default function CategoriesSection() {
  return (
    <section className="relative isolate overflow-hidden bg-background px-5 py-14 sm:px-8 sm:py-24 lg:px-12">
      {/* Decorative ambient background glows */}
      <div className="pointer-events-none absolute -left-32 top-1/3 -z-10 size-96 rounded-full bg-accent/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-1/4 -z-10 size-96 rounded-full bg-primary/5 blur-3xl" />

      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
            Explore by Specialty
          </p>

          <h2 className="mt-3 font-heading text-4xl font-semibold leading-tight tracking-tight text-foreground sm:text-5xl">
            Wedding Service Categories
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            Select a category to browse specialists tailored to every chapter of
            your wedding weekend.
          </p>
        </div>

        {/* 6 Category Cards Grid */}
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 sm:gap-7">
          {CATEGORIES.map((category) => (
            <Link
              key={category.name}
              href={`/services?category=${encodeURIComponent(category.name)}`}
              className="group relative flex aspect-[16/11] w-full flex-col justify-end overflow-hidden rounded-3xl border border-border/80 bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10 sm:aspect-[16/10]"
            >
              {/* Static Category Image */}
              <CategoryCardImage
                src={category.fallbackImage}
                fallbackSrc={category.fallbackImage}
                alt={category.name}
              />

              {/* Dark Gradients for Crisp Text Readability */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/15 transition-opacity duration-300 group-hover:from-black/90 group-hover:via-black/50" />

              {/* Card Content */}
              <div className="relative z-10 p-5 sm:p-6">
                <span className="mb-2.5 inline-flex items-center rounded-full border border-white/20 bg-white/20 px-3 py-1 text-[11px] font-medium tracking-wide text-white backdrop-blur-md shadow-xs">
                  {category.badge}
                </span>

                <h3 className="font-heading text-xl font-bold tracking-tight text-white transition-colors duration-200 group-hover:text-accent sm:text-2xl">
                  {category.name}
                </h3>

                <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-white/80 sm:text-sm">
                  {category.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
