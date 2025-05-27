"use client";

import { useEffect, useState } from "react";

type Advocate = {
  id?: string | number;
  firstName: string;
  lastName: string;
  city: string;
  degree: string;
  specialties: string[];
  yearsOfExperience: string | number;
  phoneNumber: string;
}


function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export default function Home() {
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [filteredAdvocates, setFilteredAdvocates] = useState<Advocate[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const debouncedSearch = useDebounce(searchTerm, 300);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch("/api/advocates")
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch advocates");
        return response.json();
      })
      .then((jsonResponse) => {
        setAdvocates(jsonResponse.data);
        setFilteredAdvocates(jsonResponse.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!debouncedSearch) {
      setFilteredAdvocates(advocates);
      return;
    }
    const normalizedSearch = debouncedSearch.toLowerCase();
    setFilteredAdvocates(
      advocates.filter((advocate) => {
        return (
          (advocate.firstName && advocate.firstName.toLowerCase().includes(normalizedSearch)) ||
          (advocate.lastName && advocate.lastName.toLowerCase().includes(normalizedSearch)) ||
          (advocate.city && advocate.city.toLowerCase().includes(normalizedSearch)) ||
          (advocate.degree && advocate.degree.toLowerCase().includes(normalizedSearch)) ||
          (Array.isArray(advocate.specialties) && advocate.specialties.some((s) => s.toLowerCase().includes(normalizedSearch))) ||
          (advocate.yearsOfExperience && String(advocate.yearsOfExperience).toLowerCase().includes(normalizedSearch))
        );
      })
    );
  }, [debouncedSearch, advocates]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value);
  const handleReset = () => setSearchTerm("");

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-6 flex flex-col items-center">
      <div className="w-full max-w-4xl">
        <h1 className="text-3xl md:text-4xl font-bold text-blue-800 mb-4 text-center">Solace Advocates</h1>
        <form className="bg-white rounded-lg shadow p-6 mb-6 flex flex-col md:flex-row md:items-end gap-4" aria-label="Advocate search form" role="search">
          <div className="flex-1">
            <label htmlFor="advocate-search" className="block text-sm font-medium text-gray-700 mb-1">
              Search for an advocate
            </label>
            <input
              id="advocate-search"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              type="text"
              placeholder="Name, city, degree, specialty, experience..."
              value={searchTerm}
              onChange={handleInputChange}
              autoComplete="off"
              aria-label="Search for an advocate by name, city, degree, specialty, or experience"
            />
            {searchTerm && (
              <p className="text-xs text-gray-500 mt-1" aria-live="polite">Searching for: <span className="font-semibold">{searchTerm}</span></p>
            )}
          </div>
          <button
            onClick={handleReset}
            className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition self-center"
            type="button"
            aria-label="Reset search and show all advocates"
          >
            Reset Search
          </button>
        </form>
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
            </svg>
            <span className="ml-2 text-blue-600 font-semibold">Loading advocates...</span>
          </div>
        ) : error ? (
          <div className="text-red-600 font-semibold py-8 text-center">{error}</div>
        ) : (
          <div className="overflow-x-auto rounded-lg shadow">
            <table
              className="min-w-full bg-white divide-y divide-gray-200"
              aria-label="List of Solace Advocates"
              role="table"
            >
              <caption className="sr-only">Advocates matching your search</caption>
              <thead className="bg-blue-100">
                <tr>
                  <th scope="col" className="px-4 py-2 text-left text-xs font-semibold text-blue-700 uppercase tracking-wider">First Name</th>
                  <th scope="col" className="px-4 py-2 text-left text-xs font-semibold text-blue-700 uppercase tracking-wider">Last Name</th>
                  <th scope="col" className="px-4 py-2 text-left text-xs font-semibold text-blue-700 uppercase tracking-wider">City</th>
                  <th scope="col" className="px-4 py-2 text-left text-xs font-semibold text-blue-700 uppercase tracking-wider">Degree</th>
                  <th scope="col" className="px-4 py-2 text-left text-xs font-semibold text-blue-700 uppercase tracking-wider">Specialties</th>
                  <th scope="col" className="px-4 py-2 text-left text-xs font-semibold text-blue-700 uppercase tracking-wider">Years of Experience</th>
                  <th scope="col" className="px-4 py-2 text-left text-xs font-semibold text-blue-700 uppercase tracking-wider">Phone Number</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredAdvocates.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center text-gray-500 py-8" aria-live="polite">No advocates found. Try a different search.</td>
                  </tr>
                ) : (
                  filteredAdvocates.map((advocate, idx) => (
                    <tr key={advocate.id || `${advocate.firstName}-${advocate.lastName}-${idx}`}
                        className="hover:bg-blue-50 transition">
                      <td className="px-4 py-2 whitespace-nowrap">{advocate.firstName}</td>
                      <td className="px-4 py-2 whitespace-nowrap">{advocate.lastName}</td>
                      <td className="px-4 py-2 whitespace-nowrap">{advocate.city}</td>
                      <td className="px-4 py-2 whitespace-nowrap">{advocate.degree}</td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        {Array.isArray(advocate.specialties)
                          ? advocate.specialties.map((s, i) => (
                              <span key={s + i} className="inline-block bg-blue-100 text-blue-800 rounded px-2 py-1 text-xs mr-1 mb-1">
                                {s}
                              </span>
                            ))
                          : null}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">{advocate.yearsOfExperience}</td>
                      <td className="px-4 py-2 whitespace-nowrap">{advocate.phoneNumber}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
