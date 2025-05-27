import db from "..";
import { advocates } from "../schema";

const specialties = [
  "Bipolar",
  "LGBTQ",
  "Medication/Prescribing",
  "Suicide History/Attempts",
  "General Mental Health (anxiety, depression, stress, grief, life transitions)",
  "Men's issues",
  "Relationship Issues (family, friends, couple, etc)",
  "Trauma & PTSD",
  "Personality disorders",
  "Personal growth",
  "Substance use/abuse",
  "Pediatrics",
  "Women's issues (post-partum, infertility, family planning)",
  "Chronic pain",
  "Weight loss & nutrition",
  "Eating disorders",
  "Diabetic Diet and nutrition",
  "Coaching (leadership, career, academic and wellness)",
  "Life coaching",
  "Obsessive-compulsive disorders",
  "Neuropsychological evaluations & testing (ADHD testing)",
  "Attention and Hyperactivity (ADHD)",
  "Sleep issues",
  "Schizophrenia and psychotic disorders",
  "Learning disorders",
  "Domestic abuse",
];

const randomSpecialty = () => {
  const random1 = Math.floor(Math.random() * 24);
  const random2 = Math.floor(Math.random() * (24 - random1)) + random1 + 1;

  return [random1, random2];
};

const advocateData = Array.from({ length: 120 }).map((_, i) => {
  const firstNames = ["John", "Jane", "Alice", "Michael", "Emily", "Chris", "Jessica", "David", "Laura", "Daniel", "Sarah", "James", "Megan", "Joshua", "Amanda"];
  const lastNames = ["Doe", "Smith", "Johnson", "Brown", "Davis", "Martinez", "Taylor", "Harris", "Clark", "Lewis", "Lee", "King", "Green", "Walker", "Hall"];
  const cities = ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia", "San Antonio", "San Diego", "Dallas", "San Jose", "Austin", "Jacksonville", "San Francisco", "Columbus", "Fort Worth"];
  const degrees = ["MD", "PhD", "MSW"];

  return {
    firstName: firstNames[i % firstNames.length] + i,
    lastName: lastNames[i % lastNames.length] + i,
    city: cities[i % cities.length],
    degree: degrees[i % degrees.length],
    specialties: specialties.slice(...randomSpecialty()),
    yearsOfExperience: (i % 20) + 1,
    phoneNumber: 5550000000 + i,
  };
});

export { advocateData };
