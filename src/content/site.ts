// FICTIONAL CLIENT. Menu, prices, hours and contact details are sample values for the client to confirm (see README).
import type { Photo, SiteContent } from "@/lib/types";

const P = (src: string, alt: string, width: number, height: number): Photo => ({ src: `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/images/${src}`, alt, width, height });

export const site: SiteContent = {
  name: "Ember Kitchen",
  tagline: "Wood-fired café, order ahead",
  headline: "Order ahead, pick up hot.",
  description:
    "A neighbourhood wood-fired café. Breakfast, sandwiches, bakery and coffee. Order online and pick up at the counter, pay when you collect.",
  url: "https://rtags911.github.io/ember-kitchen",
  timeZone: "America/Los_Angeles",
  address: { street: "418 Alder Street", city: "Portland, OR 97205", mapUrl: "https://www.openstreetmap.org/search?query=418%20Alder%20Street%20Portland" },
  phone: "(503) 555-0148",
  email: "hello@ember-kitchen.example",
  hours: [
    { open: "08:00", close: "14:00" }, // Sun
    null, // Mon
    { open: "07:00", close: "15:00" },
    { open: "07:00", close: "15:00" },
    { open: "07:00", close: "15:00" },
    { open: "07:00", close: "16:00" },
    { open: "08:00", close: "16:00" }, // Sat
  ],
  heroPhoto: P("oven.jpg", "A blistered flatbread on a peel in front of glowing wood embers", 1060, 589),
  visitPhoto: P("counter.jpg", "A busy café counter with jars, pastries and a hand-lettered drinks board", 960, 640),
  menu: [
    {
      id: "breakfast",
      name: "Breakfast",
      note: "Until 11:30",
      photo: P("breakfast-sandwich.jpg", "Egg, ham and cheese on a toasted English muffin", 960, 816),
      items: [
        { id: "ember-muffin", name: "Ember muffin", text: "Fried egg, smoked ham, aged cheddar, toasted English muffin", price: 900 },
        { id: "green-eggs", name: "Green eggs", text: "Soft scramble, herb oil, greens, sourdough toast", price: 1150, tags: ["V"] },
        { id: "oven-oats", name: "Oven oats", text: "Baked oats, roasted pear, maple, toasted seeds", price: 850, tags: ["VG"] },
        { id: "hash", name: "Fire hash", text: "Charred potatoes, peppers, two eggs any way", price: 1300, tags: ["GF"] },
      ],
    },
    {
      id: "sandwiches",
      name: "Sandwiches",
      note: "From 11:00",
      photo: P("sourdough.jpg", "A round sourdough loaf, freshly baked, on a board", 1920, 1440),
      items: [
        { id: "smoked-chicken", name: "Smoked chicken", text: "Wood-smoked chicken, charred lemon mayo, pickles, sourdough", price: 1400 },
        { id: "blistered-veg", name: "Blistered veg", text: "Fire-roasted peppers and squash, whipped feta, rocket", price: 1250, tags: ["V"] },
        { id: "brisket-melt", name: "Brisket melt", text: "Slow-cooked brisket, onions, Swiss, rye", price: 1550 },
        { id: "flatbread", name: "Oven flatbread", text: "Tomato, mozzarella, basil, from the wood oven", price: 1350, tags: ["V"] },
      ],
    },
    {
      id: "bakery",
      name: "Bakery",
      note: "Baked each morning",
      photo: P("croissants.jpg", "Golden croissants and sesame rolls in a basket", 960, 541),
      items: [
        { id: "croissant", name: "Butter croissant", text: "Laminated in house, baked at 6", price: 425, tags: ["V"] },
        { id: "ash-cookie", name: "Brown butter cookie", text: "Dark chocolate, flaky salt", price: 375, tags: ["V"] },
        { id: "morning-bun", name: "Morning bun", text: "Orange zest, cinnamon sugar", price: 475, tags: ["V"] },
        { id: "sourdough-loaf", name: "Sourdough loaf", text: "Whole loaf to take home", price: 900, tags: ["VG"] },
      ],
    },
    {
      id: "drinks",
      name: "Coffee & drinks",
      photo: P("latte.jpg", "Milk being poured into a latte, making a leaf pattern", 1920, 1277),
      items: [
        { id: "espresso", name: "Espresso", text: "Double shot", price: 350 },
        { id: "latte", name: "Latte", text: "12 oz, oat milk on request", price: 525 },
        { id: "cold-brew", name: "Cold brew", text: "Steeped 18 hours", price: 475 },
        { id: "chai", name: "Smoked chai", text: "House spice blend, steamed milk", price: 550 },
      ],
    },
  ],
  steps: [
    { title: "Pick your food", text: "Add anything from the menu to your bag." },
    { title: "Choose a pickup time", text: "Slots every 15 minutes while we're open. The earliest is about 20 minutes away." },
    { title: "Collect and pay", text: "Give your name at the counter. Pay there, card or cash." },
  ],
  faqs: [
    { q: "Do I pay online?", a: "No. Pay at the counter when you collect, by card or cash." },
    { q: "How soon can I pick up?", a: "The earliest slot is about 20 minutes from now. The last slot is 30 minutes before we close." },
    { q: "What if I'm late?", a: "We hold orders for 30 minutes past your pickup time. Hot food is best on time." },
    { q: "Can I change or cancel an order?", a: "Call us and we'll change it, as long as we haven't started cooking." },
    { q: "Allergies?", a: "Add a note to your order and tell us at the counter. Our kitchen handles wheat, dairy, eggs, nuts and sesame." },
    { q: "Large orders?", a: "For more than 20 items, call a day ahead so the oven is ready for you." },
  ],
};
