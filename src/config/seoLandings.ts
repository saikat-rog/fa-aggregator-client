export type SeoLandingFilters = {
  country?: string;
  state?: string;
  industries?: string[];
  page?: number;
  limit?: number;
};

export type SeoLanding = {
  slug: string;
  title: string;
  description: string;
  canonicalUrl?: string;
  filters: SeoLandingFilters;
};

export const seoLandings: Record<string, SeoLanding> = {
  "financial-advisors-alabama-united-states": {
    slug: "financial-advisors-alabama-united-states",
    title: "Financial Advisors in Alabama, United States | Folksmint",
    description: "Find verified financial advisors in Alabama, United States on Folksmint.",
    filters: {
      country: "United States",
      state: "Alabama",
    },
  },
  "financial-advisors-alaska-united-states": {
    slug: "financial-advisors-alaska-united-states",
    title: "Financial Advisors in Alaska, United States | Folksmint",
    description: "Find verified financial advisors in Alaska, United States on Folksmint.",
    filters: {
      country: "United States",
      state: "Alaska",
    },
  },
  "financial-advisors-andaman-and-nicobar-islands-india": {
    slug: "financial-advisors-andaman-and-nicobar-islands-india",
    title: "Financial Advisors in Andaman and Nicobar Islands, India | Folksmint",
    description: "Find verified financial advisors in Andaman and Nicobar Islands, India on Folksmint.",
    filters: {
      country: "India",
      state: "Andaman and Nicobar Islands",
    },
  },
  "financial-advisors-andhra-pradesh-india": {
    slug: "financial-advisors-andhra-pradesh-india",
    title: "Financial Advisors in Andhra Pradesh, India | Folksmint",
    description: "Find verified financial advisors in Andhra Pradesh, India on Folksmint.",
    filters: {
      country: "India",
      state: "Andhra Pradesh",
    },
  },
  "financial-advisors-arizona-united-states": {
    slug: "financial-advisors-arizona-united-states",
    title: "Financial Advisors in Arizona, United States | Folksmint",
    description: "Find verified financial advisors in Arizona, United States on Folksmint.",
    filters: {
      country: "United States",
      state: "Arizona",
    },
  },
  "financial-advisors-arkansas-united-states": {
    slug: "financial-advisors-arkansas-united-states",
    title: "Financial Advisors in Arkansas, United States | Folksmint",
    description: "Find verified financial advisors in Arkansas, United States on Folksmint.",
    filters: {
      country: "United States",
      state: "Arkansas",
    },
  },
  "financial-advisors-arunachal-pradesh-india": {
    slug: "financial-advisors-arunachal-pradesh-india",
    title: "Financial Advisors in Arunachal Pradesh, India | Folksmint",
    description: "Find verified financial advisors in Arunachal Pradesh, India on Folksmint.",
    filters: {
      country: "India",
      state: "Arunachal Pradesh",
    },
  },
  "financial-advisors-assam-india": {
    slug: "financial-advisors-assam-india",
    title: "Financial Advisors in Assam, India | Folksmint",
    description: "Find verified financial advisors in Assam, India on Folksmint.",
    filters: {
      country: "India",
      state: "Assam",
    },
  },
  "financial-advisors-bihar-india": {
    slug: "financial-advisors-bihar-india",
    title: "Financial Advisors in Bihar, India | Folksmint",
    description: "Find verified financial advisors in Bihar, India on Folksmint.",
    filters: {
      country: "India",
      state: "Bihar",
    },
  },
  "financial-advisors-california-united-states": {
    slug: "financial-advisors-california-united-states",
    title: "Financial Advisors in California, United States | Folksmint",
    description: "Find verified financial advisors in California, United States on Folksmint.",
    filters: {
      country: "United States",
      state: "California",
    },
  },
  "financial-advisors-chandigarh-india": {
    slug: "financial-advisors-chandigarh-india",
    title: "Financial Advisors in Chandigarh, India | Folksmint",
    description: "Find verified financial advisors in Chandigarh, India on Folksmint.",
    filters: {
      country: "India",
      state: "Chandigarh",
    },
  },
  "financial-advisors-chhattisgarh-india": {
    slug: "financial-advisors-chhattisgarh-india",
    title: "Financial Advisors in Chhattisgarh, India | Folksmint",
    description: "Find verified financial advisors in Chhattisgarh, India on Folksmint.",
    filters: {
      country: "India",
      state: "Chhattisgarh",
    },
  },
  "financial-advisors-colorado-united-states": {
    slug: "financial-advisors-colorado-united-states",
    title: "Financial Advisors in Colorado, United States | Folksmint",
    description: "Find verified financial advisors in Colorado, United States on Folksmint.",
    filters: {
      country: "United States",
      state: "Colorado",
    },
  },
  "financial-advisors-connecticut-united-states": {
    slug: "financial-advisors-connecticut-united-states",
    title: "Financial Advisors in Connecticut, United States | Folksmint",
    description: "Find verified financial advisors in Connecticut, United States on Folksmint.",
    filters: {
      country: "United States",
      state: "Connecticut",
    },
  },
  "financial-advisors-dadra-and-nagar-haveli-and-daman-and-diu-india": {
    slug: "financial-advisors-dadra-and-nagar-haveli-and-daman-and-diu-india",
    title: "Financial Advisors in Dadra and Nagar Haveli and Daman and Diu, India | Folksmint",
    description: "Find verified financial advisors in Dadra and Nagar Haveli and Daman and Diu, India on Folksmint.",
    filters: {
      country: "India",
      state: "Dadra and Nagar Haveli and Daman and Diu",
    },
  },
  "financial-advisors-delaware-united-states": {
    slug: "financial-advisors-delaware-united-states",
    title: "Financial Advisors in Delaware, United States | Folksmint",
    description: "Find verified financial advisors in Delaware, United States on Folksmint.",
    filters: {
      country: "United States",
      state: "Delaware",
    },
  },
  "financial-advisors-delhi-india": {
    slug: "financial-advisors-delhi-india",
    title: "Financial Advisors in Delhi, India | Folksmint",
    description: "Find verified financial advisors in Delhi, India on Folksmint.",
    filters: {
      country: "India",
      state: "Delhi",
    },
  },
  "financial-advisors-florida-united-states": {
    slug: "financial-advisors-florida-united-states",
    title: "Financial Advisors in Florida, United States | Folksmint",
    description: "Find verified financial advisors in Florida, United States on Folksmint.",
    filters: {
      country: "United States",
      state: "Florida",
    },
  },
  "financial-advisors-georgia-united-states": {
    slug: "financial-advisors-georgia-united-states",
    title: "Financial Advisors in Georgia, United States | Folksmint",
    description: "Find verified financial advisors in Georgia, United States on Folksmint.",
    filters: {
      country: "United States",
      state: "Georgia",
    },
  },
  "financial-advisors-goa-india": {
    slug: "financial-advisors-goa-india",
    title: "Financial Advisors in Goa, India | Folksmint",
    description: "Find verified financial advisors in Goa, India on Folksmint.",
    filters: {
      country: "India",
      state: "Goa",
    },
  },
  "financial-advisors-gujarat-india": {
    slug: "financial-advisors-gujarat-india",
    title: "Financial Advisors in Gujarat, India | Folksmint",
    description: "Find verified financial advisors in Gujarat, India on Folksmint.",
    filters: {
      country: "India",
      state: "Gujarat",
    },
  },
  "financial-advisors-haryana-india": {
    slug: "financial-advisors-haryana-india",
    title: "Financial Advisors in Haryana, India | Folksmint",
    description: "Find verified financial advisors in Haryana, India on Folksmint.",
    filters: {
      country: "India",
      state: "Haryana",
    },
  },
  "financial-advisors-hawaii-united-states": {
    slug: "financial-advisors-hawaii-united-states",
    title: "Financial Advisors in Hawaii, United States | Folksmint",
    description: "Find verified financial advisors in Hawaii, United States on Folksmint.",
    filters: {
      country: "United States",
      state: "Hawaii",
    },
  },
  "financial-advisors-himachal-pradesh-india": {
    slug: "financial-advisors-himachal-pradesh-india",
    title: "Financial Advisors in Himachal Pradesh, India | Folksmint",
    description: "Find verified financial advisors in Himachal Pradesh, India on Folksmint.",
    filters: {
      country: "India",
      state: "Himachal Pradesh",
    },
  },
  "financial-advisors-idaho-united-states": {
    slug: "financial-advisors-idaho-united-states",
    title: "Financial Advisors in Idaho, United States | Folksmint",
    description: "Find verified financial advisors in Idaho, United States on Folksmint.",
    filters: {
      country: "United States",
      state: "Idaho",
    },
  },
  "financial-advisors-illinois-united-states": {
    slug: "financial-advisors-illinois-united-states",
    title: "Financial Advisors in Illinois, United States | Folksmint",
    description: "Find verified financial advisors in Illinois, United States on Folksmint.",
    filters: {
      country: "United States",
      state: "Illinois",
    },
  },
  "financial-advisors-india": {
    slug: "financial-advisors-india",
    title: "Financial Advisors in India | Folksmint",
    description: "Find verified financial advisors in India on Folksmint.",
    filters: {
      country: "India",
      
    },
  },
  "financial-advisors-indiana-united-states": {
    slug: "financial-advisors-indiana-united-states",
    title: "Financial Advisors in Indiana, United States | Folksmint",
    description: "Find verified financial advisors in Indiana, United States on Folksmint.",
    filters: {
      country: "United States",
      state: "Indiana",
    },
  },
  "financial-advisors-iowa-united-states": {
    slug: "financial-advisors-iowa-united-states",
    title: "Financial Advisors in Iowa, United States | Folksmint",
    description: "Find verified financial advisors in Iowa, United States on Folksmint.",
    filters: {
      country: "United States",
      state: "Iowa",
    },
  },
  "financial-advisors-jammu-and-kashmir-india": {
    slug: "financial-advisors-jammu-and-kashmir-india",
    title: "Financial Advisors in Jammu and Kashmir, India | Folksmint",
    description: "Find verified financial advisors in Jammu and Kashmir, India on Folksmint.",
    filters: {
      country: "India",
      state: "Jammu and Kashmir",
    },
  },
  "financial-advisors-jharkhand-india": {
    slug: "financial-advisors-jharkhand-india",
    title: "Financial Advisors in Jharkhand, India | Folksmint",
    description: "Find verified financial advisors in Jharkhand, India on Folksmint.",
    filters: {
      country: "India",
      state: "Jharkhand",
    },
  },
  "financial-advisors-kansas-united-states": {
    slug: "financial-advisors-kansas-united-states",
    title: "Financial Advisors in Kansas, United States | Folksmint",
    description: "Find verified financial advisors in Kansas, United States on Folksmint.",
    filters: {
      country: "United States",
      state: "Kansas",
    },
  },
  "financial-advisors-karnataka-india": {
    slug: "financial-advisors-karnataka-india",
    title: "Financial Advisors in Karnataka, India | Folksmint",
    description: "Find verified financial advisors in Karnataka, India on Folksmint.",
    filters: {
      country: "India",
      state: "Karnataka",
    },
  },
  "financial-advisors-kentucky-united-states": {
    slug: "financial-advisors-kentucky-united-states",
    title: "Financial Advisors in Kentucky, United States | Folksmint",
    description: "Find verified financial advisors in Kentucky, United States on Folksmint.",
    filters: {
      country: "United States",
      state: "Kentucky",
    },
  },
  "financial-advisors-kerala-india": {
    slug: "financial-advisors-kerala-india",
    title: "Financial Advisors in Kerala, India | Folksmint",
    description: "Find verified financial advisors in Kerala, India on Folksmint.",
    filters: {
      country: "India",
      state: "Kerala",
    },
  },
  "financial-advisors-ladakh-india": {
    slug: "financial-advisors-ladakh-india",
    title: "Financial Advisors in Ladakh, India | Folksmint",
    description: "Find verified financial advisors in Ladakh, India on Folksmint.",
    filters: {
      country: "India",
      state: "Ladakh",
    },
  },
  "financial-advisors-lakshadweep-india": {
    slug: "financial-advisors-lakshadweep-india",
    title: "Financial Advisors in Lakshadweep, India | Folksmint",
    description: "Find verified financial advisors in Lakshadweep, India on Folksmint.",
    filters: {
      country: "India",
      state: "Lakshadweep",
    },
  },
  "financial-advisors-louisiana-united-states": {
    slug: "financial-advisors-louisiana-united-states",
    title: "Financial Advisors in Louisiana, United States | Folksmint",
    description: "Find verified financial advisors in Louisiana, United States on Folksmint.",
    filters: {
      country: "United States",
      state: "Louisiana",
    },
  },
  "financial-advisors-madhya-pradesh-india": {
    slug: "financial-advisors-madhya-pradesh-india",
    title: "Financial Advisors in Madhya Pradesh, India | Folksmint",
    description: "Find verified financial advisors in Madhya Pradesh, India on Folksmint.",
    filters: {
      country: "India",
      state: "Madhya Pradesh",
    },
  },
  "financial-advisors-maharashtra-india": {
    slug: "financial-advisors-maharashtra-india",
    title: "Financial Advisors in Maharashtra, India | Folksmint",
    description: "Find verified financial advisors in Maharashtra, India on Folksmint.",
    filters: {
      country: "India",
      state: "Maharashtra",
    },
  },
  "financial-advisors-maine-united-states": {
    slug: "financial-advisors-maine-united-states",
    title: "Financial Advisors in Maine, United States | Folksmint",
    description: "Find verified financial advisors in Maine, United States on Folksmint.",
    filters: {
      country: "United States",
      state: "Maine",
    },
  },
  "financial-advisors-manipur-india": {
    slug: "financial-advisors-manipur-india",
    title: "Financial Advisors in Manipur, India | Folksmint",
    description: "Find verified financial advisors in Manipur, India on Folksmint.",
    filters: {
      country: "India",
      state: "Manipur",
    },
  },
  "financial-advisors-maryland-united-states": {
    slug: "financial-advisors-maryland-united-states",
    title: "Financial Advisors in Maryland, United States | Folksmint",
    description: "Find verified financial advisors in Maryland, United States on Folksmint.",
    filters: {
      country: "United States",
      state: "Maryland",
    },
  },
  "financial-advisors-massachusetts-united-states": {
    slug: "financial-advisors-massachusetts-united-states",
    title: "Financial Advisors in Massachusetts, United States | Folksmint",
    description: "Find verified financial advisors in Massachusetts, United States on Folksmint.",
    filters: {
      country: "United States",
      state: "Massachusetts",
    },
  },
  "financial-advisors-meghalaya-india": {
    slug: "financial-advisors-meghalaya-india",
    title: "Financial Advisors in Meghalaya, India | Folksmint",
    description: "Find verified financial advisors in Meghalaya, India on Folksmint.",
    filters: {
      country: "India",
      state: "Meghalaya",
    },
  },
  "financial-advisors-michigan-united-states": {
    slug: "financial-advisors-michigan-united-states",
    title: "Financial Advisors in Michigan, United States | Folksmint",
    description: "Find verified financial advisors in Michigan, United States on Folksmint.",
    filters: {
      country: "United States",
      state: "Michigan",
    },
  },
  "financial-advisors-minnesota-united-states": {
    slug: "financial-advisors-minnesota-united-states",
    title: "Financial Advisors in Minnesota, United States | Folksmint",
    description: "Find verified financial advisors in Minnesota, United States on Folksmint.",
    filters: {
      country: "United States",
      state: "Minnesota",
    },
  },
  "financial-advisors-mississippi-united-states": {
    slug: "financial-advisors-mississippi-united-states",
    title: "Financial Advisors in Mississippi, United States | Folksmint",
    description: "Find verified financial advisors in Mississippi, United States on Folksmint.",
    filters: {
      country: "United States",
      state: "Mississippi",
    },
  },
  "financial-advisors-missouri-united-states": {
    slug: "financial-advisors-missouri-united-states",
    title: "Financial Advisors in Missouri, United States | Folksmint",
    description: "Find verified financial advisors in Missouri, United States on Folksmint.",
    filters: {
      country: "United States",
      state: "Missouri",
    },
  },
  "financial-advisors-mizoram-india": {
    slug: "financial-advisors-mizoram-india",
    title: "Financial Advisors in Mizoram, India | Folksmint",
    description: "Find verified financial advisors in Mizoram, India on Folksmint.",
    filters: {
      country: "India",
      state: "Mizoram",
    },
  },
  "financial-advisors-montana-united-states": {
    slug: "financial-advisors-montana-united-states",
    title: "Financial Advisors in Montana, United States | Folksmint",
    description: "Find verified financial advisors in Montana, United States on Folksmint.",
    filters: {
      country: "United States",
      state: "Montana",
    },
  },
  "financial-advisors-nagaland-india": {
    slug: "financial-advisors-nagaland-india",
    title: "Financial Advisors in Nagaland, India | Folksmint",
    description: "Find verified financial advisors in Nagaland, India on Folksmint.",
    filters: {
      country: "India",
      state: "Nagaland",
    },
  },
  "financial-advisors-nebraska-united-states": {
    slug: "financial-advisors-nebraska-united-states",
    title: "Financial Advisors in Nebraska, United States | Folksmint",
    description: "Find verified financial advisors in Nebraska, United States on Folksmint.",
    filters: {
      country: "United States",
      state: "Nebraska",
    },
  },
  "financial-advisors-nevada-united-states": {
    slug: "financial-advisors-nevada-united-states",
    title: "Financial Advisors in Nevada, United States | Folksmint",
    description: "Find verified financial advisors in Nevada, United States on Folksmint.",
    filters: {
      country: "United States",
      state: "Nevada",
    },
  },
  "financial-advisors-new-hampshire-united-states": {
    slug: "financial-advisors-new-hampshire-united-states",
    title: "Financial Advisors in New Hampshire, United States | Folksmint",
    description: "Find verified financial advisors in New Hampshire, United States on Folksmint.",
    filters: {
      country: "United States",
      state: "New Hampshire",
    },
  },
  "financial-advisors-new-jersey-united-states": {
    slug: "financial-advisors-new-jersey-united-states",
    title: "Financial Advisors in New Jersey, United States | Folksmint",
    description: "Find verified financial advisors in New Jersey, United States on Folksmint.",
    filters: {
      country: "United States",
      state: "New Jersey",
    },
  },
  "financial-advisors-new-mexico-united-states": {
    slug: "financial-advisors-new-mexico-united-states",
    title: "Financial Advisors in New Mexico, United States | Folksmint",
    description: "Find verified financial advisors in New Mexico, United States on Folksmint.",
    filters: {
      country: "United States",
      state: "New Mexico",
    },
  },
  "financial-advisors-new-york-united-states": {
    slug: "financial-advisors-new-york-united-states",
    title: "Financial Advisors in New York, United States | Folksmint",
    description: "Find verified financial advisors in New York, United States on Folksmint.",
    filters: {
      country: "United States",
      state: "New York",
    },
  },
  "financial-advisors-north-carolina-united-states": {
    slug: "financial-advisors-north-carolina-united-states",
    title: "Financial Advisors in North Carolina, United States | Folksmint",
    description: "Find verified financial advisors in North Carolina, United States on Folksmint.",
    filters: {
      country: "United States",
      state: "North Carolina",
    },
  },
  "financial-advisors-north-dakota-united-states": {
    slug: "financial-advisors-north-dakota-united-states",
    title: "Financial Advisors in North Dakota, United States | Folksmint",
    description: "Find verified financial advisors in North Dakota, United States on Folksmint.",
    filters: {
      country: "United States",
      state: "North Dakota",
    },
  },
  "financial-advisors-odisha-india": {
    slug: "financial-advisors-odisha-india",
    title: "Financial Advisors in Odisha, India | Folksmint",
    description: "Find verified financial advisors in Odisha, India on Folksmint.",
    filters: {
      country: "India",
      state: "Odisha",
    },
  },
  "financial-advisors-ohio-united-states": {
    slug: "financial-advisors-ohio-united-states",
    title: "Financial Advisors in Ohio, United States | Folksmint",
    description: "Find verified financial advisors in Ohio, United States on Folksmint.",
    filters: {
      country: "United States",
      state: "Ohio",
    },
  },
  "financial-advisors-oklahoma-united-states": {
    slug: "financial-advisors-oklahoma-united-states",
    title: "Financial Advisors in Oklahoma, United States | Folksmint",
    description: "Find verified financial advisors in Oklahoma, United States on Folksmint.",
    filters: {
      country: "United States",
      state: "Oklahoma",
    },
  },
  "financial-advisors-oregon-united-states": {
    slug: "financial-advisors-oregon-united-states",
    title: "Financial Advisors in Oregon, United States | Folksmint",
    description: "Find verified financial advisors in Oregon, United States on Folksmint.",
    filters: {
      country: "United States",
      state: "Oregon",
    },
  },
  "financial-advisors-pennsylvania-united-states": {
    slug: "financial-advisors-pennsylvania-united-states",
    title: "Financial Advisors in Pennsylvania, United States | Folksmint",
    description: "Find verified financial advisors in Pennsylvania, United States on Folksmint.",
    filters: {
      country: "United States",
      state: "Pennsylvania",
    },
  },
  "financial-advisors-puducherry-india": {
    slug: "financial-advisors-puducherry-india",
    title: "Financial Advisors in Puducherry, India | Folksmint",
    description: "Find verified financial advisors in Puducherry, India on Folksmint.",
    filters: {
      country: "India",
      state: "Puducherry",
    },
  },
  "financial-advisors-punjab-india": {
    slug: "financial-advisors-punjab-india",
    title: "Financial Advisors in Punjab, India | Folksmint",
    description: "Find verified financial advisors in Punjab, India on Folksmint.",
    filters: {
      country: "India",
      state: "Punjab",
    },
  },
  "financial-advisors-rajasthan-india": {
    slug: "financial-advisors-rajasthan-india",
    title: "Financial Advisors in Rajasthan, India | Folksmint",
    description: "Find verified financial advisors in Rajasthan, India on Folksmint.",
    filters: {
      country: "India",
      state: "Rajasthan",
    },
  },
  "financial-advisors-rhode-island-united-states": {
    slug: "financial-advisors-rhode-island-united-states",
    title: "Financial Advisors in Rhode Island, United States | Folksmint",
    description: "Find verified financial advisors in Rhode Island, United States on Folksmint.",
    filters: {
      country: "United States",
      state: "Rhode Island",
    },
  },
  "financial-advisors-sikkim-india": {
    slug: "financial-advisors-sikkim-india",
    title: "Financial Advisors in Sikkim, India | Folksmint",
    description: "Find verified financial advisors in Sikkim, India on Folksmint.",
    filters: {
      country: "India",
      state: "Sikkim",
    },
  },
  "financial-advisors-south-carolina-united-states": {
    slug: "financial-advisors-south-carolina-united-states",
    title: "Financial Advisors in South Carolina, United States | Folksmint",
    description: "Find verified financial advisors in South Carolina, United States on Folksmint.",
    filters: {
      country: "United States",
      state: "South Carolina",
    },
  },
  "financial-advisors-south-dakota-united-states": {
    slug: "financial-advisors-south-dakota-united-states",
    title: "Financial Advisors in South Dakota, United States | Folksmint",
    description: "Find verified financial advisors in South Dakota, United States on Folksmint.",
    filters: {
      country: "United States",
      state: "South Dakota",
    },
  },
  "financial-advisors-tamil-nadu-india": {
    slug: "financial-advisors-tamil-nadu-india",
    title: "Financial Advisors in Tamil Nadu, India | Folksmint",
    description: "Find verified financial advisors in Tamil Nadu, India on Folksmint.",
    filters: {
      country: "India",
      state: "Tamil Nadu",
    },
  },
  "financial-advisors-telangana-india": {
    slug: "financial-advisors-telangana-india",
    title: "Financial Advisors in Telangana, India | Folksmint",
    description: "Find verified financial advisors in Telangana, India on Folksmint.",
    filters: {
      country: "India",
      state: "Telangana",
    },
  },
  "financial-advisors-tennessee-united-states": {
    slug: "financial-advisors-tennessee-united-states",
    title: "Financial Advisors in Tennessee, United States | Folksmint",
    description: "Find verified financial advisors in Tennessee, United States on Folksmint.",
    filters: {
      country: "United States",
      state: "Tennessee",
    },
  },
  "financial-advisors-texas-united-states": {
    slug: "financial-advisors-texas-united-states",
    title: "Financial Advisors in Texas, United States | Folksmint",
    description: "Find verified financial advisors in Texas, United States on Folksmint.",
    filters: {
      country: "United States",
      state: "Texas",
    },
  },
  "financial-advisors-tripura-india": {
    slug: "financial-advisors-tripura-india",
    title: "Financial Advisors in Tripura, India | Folksmint",
    description: "Find verified financial advisors in Tripura, India on Folksmint.",
    filters: {
      country: "India",
      state: "Tripura",
    },
  },
  "financial-advisors-united-states": {
    slug: "financial-advisors-united-states",
    title: "Financial Advisors in United States | Folksmint",
    description: "Find verified financial advisors in United States on Folksmint.",
    filters: {
      country: "United States",
      
    },
  },
  "financial-advisors-utah-united-states": {
    slug: "financial-advisors-utah-united-states",
    title: "Financial Advisors in Utah, United States | Folksmint",
    description: "Find verified financial advisors in Utah, United States on Folksmint.",
    filters: {
      country: "United States",
      state: "Utah",
    },
  },
  "financial-advisors-uttar-pradesh-india": {
    slug: "financial-advisors-uttar-pradesh-india",
    title: "Financial Advisors in Uttar Pradesh, India | Folksmint",
    description: "Find verified financial advisors in Uttar Pradesh, India on Folksmint.",
    filters: {
      country: "India",
      state: "Uttar Pradesh",
    },
  },
  "financial-advisors-uttarakhand-india": {
    slug: "financial-advisors-uttarakhand-india",
    title: "Financial Advisors in Uttarakhand, India | Folksmint",
    description: "Find verified financial advisors in Uttarakhand, India on Folksmint.",
    filters: {
      country: "India",
      state: "Uttarakhand",
    },
  },
  "financial-advisors-vermont-united-states": {
    slug: "financial-advisors-vermont-united-states",
    title: "Financial Advisors in Vermont, United States | Folksmint",
    description: "Find verified financial advisors in Vermont, United States on Folksmint.",
    filters: {
      country: "United States",
      state: "Vermont",
    },
  },
  "financial-advisors-virginia-united-states": {
    slug: "financial-advisors-virginia-united-states",
    title: "Financial Advisors in Virginia, United States | Folksmint",
    description: "Find verified financial advisors in Virginia, United States on Folksmint.",
    filters: {
      country: "United States",
      state: "Virginia",
    },
  },
  "financial-advisors-washington-united-states": {
    slug: "financial-advisors-washington-united-states",
    title: "Financial Advisors in Washington, United States | Folksmint",
    description: "Find verified financial advisors in Washington, United States on Folksmint.",
    filters: {
      country: "United States",
      state: "Washington",
    },
  },
  "financial-advisors-west-bengal-india": {
    slug: "financial-advisors-west-bengal-india",
    title: "Financial Advisors in West Bengal, India | Folksmint",
    description: "Find verified financial advisors in West Bengal, India on Folksmint.",
    filters: {
      country: "India",
      state: "West Bengal",
    },
  },
  "financial-advisors-west-virginia-united-states": {
    slug: "financial-advisors-west-virginia-united-states",
    title: "Financial Advisors in West Virginia, United States | Folksmint",
    description: "Find verified financial advisors in West Virginia, United States on Folksmint.",
    filters: {
      country: "United States",
      state: "West Virginia",
    },
  },
  "financial-advisors-wisconsin-united-states": {
    slug: "financial-advisors-wisconsin-united-states",
    title: "Financial Advisors in Wisconsin, United States | Folksmint",
    description: "Find verified financial advisors in Wisconsin, United States on Folksmint.",
    filters: {
      country: "United States",
      state: "Wisconsin",
    },
  },
  "financial-advisors-wyoming-united-states": {
    slug: "financial-advisors-wyoming-united-states",
    title: "Financial Advisors in Wyoming, United States | Folksmint",
    description: "Find verified financial advisors in Wyoming, United States on Folksmint.",
    filters: {
      country: "United States",
      state: "Wyoming",
    },
  },
};
