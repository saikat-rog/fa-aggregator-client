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
  "financial-advisors-afghanistan": {
    slug: "financial-advisors-afghanistan",
    title: "Financial Advisors in Afghanistan | Folksmint",
    description: "Find verified financial advisors in Afghanistan on Folksmint.",
    filters: {
      country: "Afghanistan",
      
    },
  },
  "financial-advisors-albania": {
    slug: "financial-advisors-albania",
    title: "Financial Advisors in Albania | Folksmint",
    description: "Find verified financial advisors in Albania on Folksmint.",
    filters: {
      country: "Albania",
      
    },
  },
  "financial-advisors-algeria": {
    slug: "financial-advisors-algeria",
    title: "Financial Advisors in Algeria | Folksmint",
    description: "Find verified financial advisors in Algeria on Folksmint.",
    filters: {
      country: "Algeria",
      
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
  "financial-advisors-andorra": {
    slug: "financial-advisors-andorra",
    title: "Financial Advisors in Andorra | Folksmint",
    description: "Find verified financial advisors in Andorra on Folksmint.",
    filters: {
      country: "Andorra",
      
    },
  },
  "financial-advisors-angola": {
    slug: "financial-advisors-angola",
    title: "Financial Advisors in Angola | Folksmint",
    description: "Find verified financial advisors in Angola on Folksmint.",
    filters: {
      country: "Angola",
      
    },
  },
  "financial-advisors-antigua-and-barbuda": {
    slug: "financial-advisors-antigua-and-barbuda",
    title: "Financial Advisors in Antigua and Barbuda | Folksmint",
    description: "Find verified financial advisors in Antigua and Barbuda on Folksmint.",
    filters: {
      country: "Antigua and Barbuda",
      
    },
  },
  "financial-advisors-argentina": {
    slug: "financial-advisors-argentina",
    title: "Financial Advisors in Argentina | Folksmint",
    description: "Find verified financial advisors in Argentina on Folksmint.",
    filters: {
      country: "Argentina",
      
    },
  },
  "financial-advisors-armenia": {
    slug: "financial-advisors-armenia",
    title: "Financial Advisors in Armenia | Folksmint",
    description: "Find verified financial advisors in Armenia on Folksmint.",
    filters: {
      country: "Armenia",
      
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
  "financial-advisors-australia": {
    slug: "financial-advisors-australia",
    title: "Financial Advisors in Australia | Folksmint",
    description: "Find verified financial advisors in Australia on Folksmint.",
    filters: {
      country: "Australia",
      
    },
  },
  "financial-advisors-austria": {
    slug: "financial-advisors-austria",
    title: "Financial Advisors in Austria | Folksmint",
    description: "Find verified financial advisors in Austria on Folksmint.",
    filters: {
      country: "Austria",
      
    },
  },
  "financial-advisors-azerbaijan": {
    slug: "financial-advisors-azerbaijan",
    title: "Financial Advisors in Azerbaijan | Folksmint",
    description: "Find verified financial advisors in Azerbaijan on Folksmint.",
    filters: {
      country: "Azerbaijan",
      
    },
  },
  "financial-advisors-bahamas": {
    slug: "financial-advisors-bahamas",
    title: "Financial Advisors in Bahamas | Folksmint",
    description: "Find verified financial advisors in Bahamas on Folksmint.",
    filters: {
      country: "Bahamas",
      
    },
  },
  "financial-advisors-bahrain": {
    slug: "financial-advisors-bahrain",
    title: "Financial Advisors in Bahrain | Folksmint",
    description: "Find verified financial advisors in Bahrain on Folksmint.",
    filters: {
      country: "Bahrain",
      
    },
  },
  "financial-advisors-bangladesh": {
    slug: "financial-advisors-bangladesh",
    title: "Financial Advisors in Bangladesh | Folksmint",
    description: "Find verified financial advisors in Bangladesh on Folksmint.",
    filters: {
      country: "Bangladesh",
      
    },
  },
  "financial-advisors-barbados": {
    slug: "financial-advisors-barbados",
    title: "Financial Advisors in Barbados | Folksmint",
    description: "Find verified financial advisors in Barbados on Folksmint.",
    filters: {
      country: "Barbados",
      
    },
  },
  "financial-advisors-belarus": {
    slug: "financial-advisors-belarus",
    title: "Financial Advisors in Belarus | Folksmint",
    description: "Find verified financial advisors in Belarus on Folksmint.",
    filters: {
      country: "Belarus",
      
    },
  },
  "financial-advisors-belgium": {
    slug: "financial-advisors-belgium",
    title: "Financial Advisors in Belgium | Folksmint",
    description: "Find verified financial advisors in Belgium on Folksmint.",
    filters: {
      country: "Belgium",
      
    },
  },
  "financial-advisors-belize": {
    slug: "financial-advisors-belize",
    title: "Financial Advisors in Belize | Folksmint",
    description: "Find verified financial advisors in Belize on Folksmint.",
    filters: {
      country: "Belize",
      
    },
  },
  "financial-advisors-benin": {
    slug: "financial-advisors-benin",
    title: "Financial Advisors in Benin | Folksmint",
    description: "Find verified financial advisors in Benin on Folksmint.",
    filters: {
      country: "Benin",
      
    },
  },
  "financial-advisors-bhutan": {
    slug: "financial-advisors-bhutan",
    title: "Financial Advisors in Bhutan | Folksmint",
    description: "Find verified financial advisors in Bhutan on Folksmint.",
    filters: {
      country: "Bhutan",
      
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
  "financial-advisors-bolivia": {
    slug: "financial-advisors-bolivia",
    title: "Financial Advisors in Bolivia | Folksmint",
    description: "Find verified financial advisors in Bolivia on Folksmint.",
    filters: {
      country: "Bolivia",
      
    },
  },
  "financial-advisors-bosnia-and-herzegovina": {
    slug: "financial-advisors-bosnia-and-herzegovina",
    title: "Financial Advisors in Bosnia and Herzegovina | Folksmint",
    description: "Find verified financial advisors in Bosnia and Herzegovina on Folksmint.",
    filters: {
      country: "Bosnia and Herzegovina",
      
    },
  },
  "financial-advisors-botswana": {
    slug: "financial-advisors-botswana",
    title: "Financial Advisors in Botswana | Folksmint",
    description: "Find verified financial advisors in Botswana on Folksmint.",
    filters: {
      country: "Botswana",
      
    },
  },
  "financial-advisors-brazil": {
    slug: "financial-advisors-brazil",
    title: "Financial Advisors in Brazil | Folksmint",
    description: "Find verified financial advisors in Brazil on Folksmint.",
    filters: {
      country: "Brazil",
      
    },
  },
  "financial-advisors-brunei": {
    slug: "financial-advisors-brunei",
    title: "Financial Advisors in Brunei | Folksmint",
    description: "Find verified financial advisors in Brunei on Folksmint.",
    filters: {
      country: "Brunei",
      
    },
  },
  "financial-advisors-bulgaria": {
    slug: "financial-advisors-bulgaria",
    title: "Financial Advisors in Bulgaria | Folksmint",
    description: "Find verified financial advisors in Bulgaria on Folksmint.",
    filters: {
      country: "Bulgaria",
      
    },
  },
  "financial-advisors-burkina-faso": {
    slug: "financial-advisors-burkina-faso",
    title: "Financial Advisors in Burkina Faso | Folksmint",
    description: "Find verified financial advisors in Burkina Faso on Folksmint.",
    filters: {
      country: "Burkina Faso",
      
    },
  },
  "financial-advisors-burundi": {
    slug: "financial-advisors-burundi",
    title: "Financial Advisors in Burundi | Folksmint",
    description: "Find verified financial advisors in Burundi on Folksmint.",
    filters: {
      country: "Burundi",
      
    },
  },
  "financial-advisors-cabo-verde": {
    slug: "financial-advisors-cabo-verde",
    title: "Financial Advisors in Cabo Verde | Folksmint",
    description: "Find verified financial advisors in Cabo Verde on Folksmint.",
    filters: {
      country: "Cabo Verde",
      
    },
  },
  "financial-advisors-cambodia": {
    slug: "financial-advisors-cambodia",
    title: "Financial Advisors in Cambodia | Folksmint",
    description: "Find verified financial advisors in Cambodia on Folksmint.",
    filters: {
      country: "Cambodia",
      
    },
  },
  "financial-advisors-cameroon": {
    slug: "financial-advisors-cameroon",
    title: "Financial Advisors in Cameroon | Folksmint",
    description: "Find verified financial advisors in Cameroon on Folksmint.",
    filters: {
      country: "Cameroon",
      
    },
  },
  "financial-advisors-canada": {
    slug: "financial-advisors-canada",
    title: "Financial Advisors in Canada | Folksmint",
    description: "Find verified financial advisors in Canada on Folksmint.",
    filters: {
      country: "Canada",
      
    },
  },
  "financial-advisors-central-african-republic": {
    slug: "financial-advisors-central-african-republic",
    title: "Financial Advisors in Central African Republic | Folksmint",
    description: "Find verified financial advisors in Central African Republic on Folksmint.",
    filters: {
      country: "Central African Republic",
      
    },
  },
  "financial-advisors-chad": {
    slug: "financial-advisors-chad",
    title: "Financial Advisors in Chad | Folksmint",
    description: "Find verified financial advisors in Chad on Folksmint.",
    filters: {
      country: "Chad",
      
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
  "financial-advisors-chile": {
    slug: "financial-advisors-chile",
    title: "Financial Advisors in Chile | Folksmint",
    description: "Find verified financial advisors in Chile on Folksmint.",
    filters: {
      country: "Chile",
      
    },
  },
  "financial-advisors-china": {
    slug: "financial-advisors-china",
    title: "Financial Advisors in China | Folksmint",
    description: "Find verified financial advisors in China on Folksmint.",
    filters: {
      country: "China",
      
    },
  },
  "financial-advisors-colombia": {
    slug: "financial-advisors-colombia",
    title: "Financial Advisors in Colombia | Folksmint",
    description: "Find verified financial advisors in Colombia on Folksmint.",
    filters: {
      country: "Colombia",
      
    },
  },
  "financial-advisors-comoros": {
    slug: "financial-advisors-comoros",
    title: "Financial Advisors in Comoros | Folksmint",
    description: "Find verified financial advisors in Comoros on Folksmint.",
    filters: {
      country: "Comoros",
      
    },
  },
  "financial-advisors-congo": {
    slug: "financial-advisors-congo",
    title: "Financial Advisors in Congo | Folksmint",
    description: "Find verified financial advisors in Congo on Folksmint.",
    filters: {
      country: "Congo",
      
    },
  },
  "financial-advisors-costa-rica": {
    slug: "financial-advisors-costa-rica",
    title: "Financial Advisors in Costa Rica | Folksmint",
    description: "Find verified financial advisors in Costa Rica on Folksmint.",
    filters: {
      country: "Costa Rica",
      
    },
  },
  "financial-advisors-cote-divoire": {
    slug: "financial-advisors-cote-divoire",
    title: "Financial Advisors in Cote d'Ivoire | Folksmint",
    description: "Find verified financial advisors in Cote d'Ivoire on Folksmint.",
    filters: {
      country: "Cote d'Ivoire",
      
    },
  },
  "financial-advisors-croatia": {
    slug: "financial-advisors-croatia",
    title: "Financial Advisors in Croatia | Folksmint",
    description: "Find verified financial advisors in Croatia on Folksmint.",
    filters: {
      country: "Croatia",
      
    },
  },
  "financial-advisors-cuba": {
    slug: "financial-advisors-cuba",
    title: "Financial Advisors in Cuba | Folksmint",
    description: "Find verified financial advisors in Cuba on Folksmint.",
    filters: {
      country: "Cuba",
      
    },
  },
  "financial-advisors-cyprus": {
    slug: "financial-advisors-cyprus",
    title: "Financial Advisors in Cyprus | Folksmint",
    description: "Find verified financial advisors in Cyprus on Folksmint.",
    filters: {
      country: "Cyprus",
      
    },
  },
  "financial-advisors-czechia": {
    slug: "financial-advisors-czechia",
    title: "Financial Advisors in Czechia | Folksmint",
    description: "Find verified financial advisors in Czechia on Folksmint.",
    filters: {
      country: "Czechia",
      
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
  "financial-advisors-delhi-india": {
    slug: "financial-advisors-delhi-india",
    title: "Financial Advisors in Delhi, India | Folksmint",
    description: "Find verified financial advisors in Delhi, India on Folksmint.",
    filters: {
      country: "India",
      state: "Delhi",
    },
  },
  "financial-advisors-denmark": {
    slug: "financial-advisors-denmark",
    title: "Financial Advisors in Denmark | Folksmint",
    description: "Find verified financial advisors in Denmark on Folksmint.",
    filters: {
      country: "Denmark",
      
    },
  },
  "financial-advisors-djibouti": {
    slug: "financial-advisors-djibouti",
    title: "Financial Advisors in Djibouti | Folksmint",
    description: "Find verified financial advisors in Djibouti on Folksmint.",
    filters: {
      country: "Djibouti",
      
    },
  },
  "financial-advisors-dominica": {
    slug: "financial-advisors-dominica",
    title: "Financial Advisors in Dominica | Folksmint",
    description: "Find verified financial advisors in Dominica on Folksmint.",
    filters: {
      country: "Dominica",
      
    },
  },
  "financial-advisors-dominican-republic": {
    slug: "financial-advisors-dominican-republic",
    title: "Financial Advisors in Dominican Republic | Folksmint",
    description: "Find verified financial advisors in Dominican Republic on Folksmint.",
    filters: {
      country: "Dominican Republic",
      
    },
  },
  "financial-advisors-dr-congo": {
    slug: "financial-advisors-dr-congo",
    title: "Financial Advisors in DR Congo | Folksmint",
    description: "Find verified financial advisors in DR Congo on Folksmint.",
    filters: {
      country: "DR Congo",
      
    },
  },
  "financial-advisors-ecuador": {
    slug: "financial-advisors-ecuador",
    title: "Financial Advisors in Ecuador | Folksmint",
    description: "Find verified financial advisors in Ecuador on Folksmint.",
    filters: {
      country: "Ecuador",
      
    },
  },
  "financial-advisors-egypt": {
    slug: "financial-advisors-egypt",
    title: "Financial Advisors in Egypt | Folksmint",
    description: "Find verified financial advisors in Egypt on Folksmint.",
    filters: {
      country: "Egypt",
      
    },
  },
  "financial-advisors-el-salvador": {
    slug: "financial-advisors-el-salvador",
    title: "Financial Advisors in El Salvador | Folksmint",
    description: "Find verified financial advisors in El Salvador on Folksmint.",
    filters: {
      country: "El Salvador",
      
    },
  },
  "financial-advisors-equatorial-guinea": {
    slug: "financial-advisors-equatorial-guinea",
    title: "Financial Advisors in Equatorial Guinea | Folksmint",
    description: "Find verified financial advisors in Equatorial Guinea on Folksmint.",
    filters: {
      country: "Equatorial Guinea",
      
    },
  },
  "financial-advisors-eritrea": {
    slug: "financial-advisors-eritrea",
    title: "Financial Advisors in Eritrea | Folksmint",
    description: "Find verified financial advisors in Eritrea on Folksmint.",
    filters: {
      country: "Eritrea",
      
    },
  },
  "financial-advisors-estonia": {
    slug: "financial-advisors-estonia",
    title: "Financial Advisors in Estonia | Folksmint",
    description: "Find verified financial advisors in Estonia on Folksmint.",
    filters: {
      country: "Estonia",
      
    },
  },
  "financial-advisors-eswatini": {
    slug: "financial-advisors-eswatini",
    title: "Financial Advisors in Eswatini | Folksmint",
    description: "Find verified financial advisors in Eswatini on Folksmint.",
    filters: {
      country: "Eswatini",
      
    },
  },
  "financial-advisors-ethiopia": {
    slug: "financial-advisors-ethiopia",
    title: "Financial Advisors in Ethiopia | Folksmint",
    description: "Find verified financial advisors in Ethiopia on Folksmint.",
    filters: {
      country: "Ethiopia",
      
    },
  },
  "financial-advisors-fiji": {
    slug: "financial-advisors-fiji",
    title: "Financial Advisors in Fiji | Folksmint",
    description: "Find verified financial advisors in Fiji on Folksmint.",
    filters: {
      country: "Fiji",
      
    },
  },
  "financial-advisors-finland": {
    slug: "financial-advisors-finland",
    title: "Financial Advisors in Finland | Folksmint",
    description: "Find verified financial advisors in Finland on Folksmint.",
    filters: {
      country: "Finland",
      
    },
  },
  "financial-advisors-france": {
    slug: "financial-advisors-france",
    title: "Financial Advisors in France | Folksmint",
    description: "Find verified financial advisors in France on Folksmint.",
    filters: {
      country: "France",
      
    },
  },
  "financial-advisors-gabon": {
    slug: "financial-advisors-gabon",
    title: "Financial Advisors in Gabon | Folksmint",
    description: "Find verified financial advisors in Gabon on Folksmint.",
    filters: {
      country: "Gabon",
      
    },
  },
  "financial-advisors-gambia": {
    slug: "financial-advisors-gambia",
    title: "Financial Advisors in Gambia | Folksmint",
    description: "Find verified financial advisors in Gambia on Folksmint.",
    filters: {
      country: "Gambia",
      
    },
  },
  "financial-advisors-georgia": {
    slug: "financial-advisors-georgia",
    title: "Financial Advisors in Georgia | Folksmint",
    description: "Find verified financial advisors in Georgia on Folksmint.",
    filters: {
      country: "Georgia",
      
    },
  },
  "financial-advisors-germany": {
    slug: "financial-advisors-germany",
    title: "Financial Advisors in Germany | Folksmint",
    description: "Find verified financial advisors in Germany on Folksmint.",
    filters: {
      country: "Germany",
      
    },
  },
  "financial-advisors-ghana": {
    slug: "financial-advisors-ghana",
    title: "Financial Advisors in Ghana | Folksmint",
    description: "Find verified financial advisors in Ghana on Folksmint.",
    filters: {
      country: "Ghana",
      
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
  "financial-advisors-greece": {
    slug: "financial-advisors-greece",
    title: "Financial Advisors in Greece | Folksmint",
    description: "Find verified financial advisors in Greece on Folksmint.",
    filters: {
      country: "Greece",
      
    },
  },
  "financial-advisors-grenada": {
    slug: "financial-advisors-grenada",
    title: "Financial Advisors in Grenada | Folksmint",
    description: "Find verified financial advisors in Grenada on Folksmint.",
    filters: {
      country: "Grenada",
      
    },
  },
  "financial-advisors-guatemala": {
    slug: "financial-advisors-guatemala",
    title: "Financial Advisors in Guatemala | Folksmint",
    description: "Find verified financial advisors in Guatemala on Folksmint.",
    filters: {
      country: "Guatemala",
      
    },
  },
  "financial-advisors-guinea": {
    slug: "financial-advisors-guinea",
    title: "Financial Advisors in Guinea | Folksmint",
    description: "Find verified financial advisors in Guinea on Folksmint.",
    filters: {
      country: "Guinea",
      
    },
  },
  "financial-advisors-guinea-bissau": {
    slug: "financial-advisors-guinea-bissau",
    title: "Financial Advisors in Guinea-Bissau | Folksmint",
    description: "Find verified financial advisors in Guinea-Bissau on Folksmint.",
    filters: {
      country: "Guinea-Bissau",
      
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
  "financial-advisors-guyana": {
    slug: "financial-advisors-guyana",
    title: "Financial Advisors in Guyana | Folksmint",
    description: "Find verified financial advisors in Guyana on Folksmint.",
    filters: {
      country: "Guyana",
      
    },
  },
  "financial-advisors-haiti": {
    slug: "financial-advisors-haiti",
    title: "Financial Advisors in Haiti | Folksmint",
    description: "Find verified financial advisors in Haiti on Folksmint.",
    filters: {
      country: "Haiti",
      
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
  "financial-advisors-himachal-pradesh-india": {
    slug: "financial-advisors-himachal-pradesh-india",
    title: "Financial Advisors in Himachal Pradesh, India | Folksmint",
    description: "Find verified financial advisors in Himachal Pradesh, India on Folksmint.",
    filters: {
      country: "India",
      state: "Himachal Pradesh",
    },
  },
  "financial-advisors-honduras": {
    slug: "financial-advisors-honduras",
    title: "Financial Advisors in Honduras | Folksmint",
    description: "Find verified financial advisors in Honduras on Folksmint.",
    filters: {
      country: "Honduras",
      
    },
  },
  "financial-advisors-hong-kong": {
    slug: "financial-advisors-hong-kong",
    title: "Financial Advisors in Hong Kong | Folksmint",
    description: "Find verified financial advisors in Hong Kong on Folksmint.",
    filters: {
      country: "Hong Kong",
      
    },
  },
  "financial-advisors-hungary": {
    slug: "financial-advisors-hungary",
    title: "Financial Advisors in Hungary | Folksmint",
    description: "Find verified financial advisors in Hungary on Folksmint.",
    filters: {
      country: "Hungary",
      
    },
  },
  "financial-advisors-iceland": {
    slug: "financial-advisors-iceland",
    title: "Financial Advisors in Iceland | Folksmint",
    description: "Find verified financial advisors in Iceland on Folksmint.",
    filters: {
      country: "Iceland",
      
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
  "financial-advisors-indonesia": {
    slug: "financial-advisors-indonesia",
    title: "Financial Advisors in Indonesia | Folksmint",
    description: "Find verified financial advisors in Indonesia on Folksmint.",
    filters: {
      country: "Indonesia",
      
    },
  },
  "financial-advisors-iran": {
    slug: "financial-advisors-iran",
    title: "Financial Advisors in Iran | Folksmint",
    description: "Find verified financial advisors in Iran on Folksmint.",
    filters: {
      country: "Iran",
      
    },
  },
  "financial-advisors-iraq": {
    slug: "financial-advisors-iraq",
    title: "Financial Advisors in Iraq | Folksmint",
    description: "Find verified financial advisors in Iraq on Folksmint.",
    filters: {
      country: "Iraq",
      
    },
  },
  "financial-advisors-ireland": {
    slug: "financial-advisors-ireland",
    title: "Financial Advisors in Ireland | Folksmint",
    description: "Find verified financial advisors in Ireland on Folksmint.",
    filters: {
      country: "Ireland",
      
    },
  },
  "financial-advisors-israel": {
    slug: "financial-advisors-israel",
    title: "Financial Advisors in Israel | Folksmint",
    description: "Find verified financial advisors in Israel on Folksmint.",
    filters: {
      country: "Israel",
      
    },
  },
  "financial-advisors-italy": {
    slug: "financial-advisors-italy",
    title: "Financial Advisors in Italy | Folksmint",
    description: "Find verified financial advisors in Italy on Folksmint.",
    filters: {
      country: "Italy",
      
    },
  },
  "financial-advisors-jamaica": {
    slug: "financial-advisors-jamaica",
    title: "Financial Advisors in Jamaica | Folksmint",
    description: "Find verified financial advisors in Jamaica on Folksmint.",
    filters: {
      country: "Jamaica",
      
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
  "financial-advisors-japan": {
    slug: "financial-advisors-japan",
    title: "Financial Advisors in Japan | Folksmint",
    description: "Find verified financial advisors in Japan on Folksmint.",
    filters: {
      country: "Japan",
      
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
  "financial-advisors-jordan": {
    slug: "financial-advisors-jordan",
    title: "Financial Advisors in Jordan | Folksmint",
    description: "Find verified financial advisors in Jordan on Folksmint.",
    filters: {
      country: "Jordan",
      
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
  "financial-advisors-kazakhstan": {
    slug: "financial-advisors-kazakhstan",
    title: "Financial Advisors in Kazakhstan | Folksmint",
    description: "Find verified financial advisors in Kazakhstan on Folksmint.",
    filters: {
      country: "Kazakhstan",
      
    },
  },
  "financial-advisors-kenya": {
    slug: "financial-advisors-kenya",
    title: "Financial Advisors in Kenya | Folksmint",
    description: "Find verified financial advisors in Kenya on Folksmint.",
    filters: {
      country: "Kenya",
      
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
  "financial-advisors-kiribati": {
    slug: "financial-advisors-kiribati",
    title: "Financial Advisors in Kiribati | Folksmint",
    description: "Find verified financial advisors in Kiribati on Folksmint.",
    filters: {
      country: "Kiribati",
      
    },
  },
  "financial-advisors-kuwait": {
    slug: "financial-advisors-kuwait",
    title: "Financial Advisors in Kuwait | Folksmint",
    description: "Find verified financial advisors in Kuwait on Folksmint.",
    filters: {
      country: "Kuwait",
      
    },
  },
  "financial-advisors-kyrgyzstan": {
    slug: "financial-advisors-kyrgyzstan",
    title: "Financial Advisors in Kyrgyzstan | Folksmint",
    description: "Find verified financial advisors in Kyrgyzstan on Folksmint.",
    filters: {
      country: "Kyrgyzstan",
      
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
  "financial-advisors-laos": {
    slug: "financial-advisors-laos",
    title: "Financial Advisors in Laos | Folksmint",
    description: "Find verified financial advisors in Laos on Folksmint.",
    filters: {
      country: "Laos",
      
    },
  },
  "financial-advisors-latvia": {
    slug: "financial-advisors-latvia",
    title: "Financial Advisors in Latvia | Folksmint",
    description: "Find verified financial advisors in Latvia on Folksmint.",
    filters: {
      country: "Latvia",
      
    },
  },
  "financial-advisors-lebanon": {
    slug: "financial-advisors-lebanon",
    title: "Financial Advisors in Lebanon | Folksmint",
    description: "Find verified financial advisors in Lebanon on Folksmint.",
    filters: {
      country: "Lebanon",
      
    },
  },
  "financial-advisors-lesotho": {
    slug: "financial-advisors-lesotho",
    title: "Financial Advisors in Lesotho | Folksmint",
    description: "Find verified financial advisors in Lesotho on Folksmint.",
    filters: {
      country: "Lesotho",
      
    },
  },
  "financial-advisors-liberia": {
    slug: "financial-advisors-liberia",
    title: "Financial Advisors in Liberia | Folksmint",
    description: "Find verified financial advisors in Liberia on Folksmint.",
    filters: {
      country: "Liberia",
      
    },
  },
  "financial-advisors-libya": {
    slug: "financial-advisors-libya",
    title: "Financial Advisors in Libya | Folksmint",
    description: "Find verified financial advisors in Libya on Folksmint.",
    filters: {
      country: "Libya",
      
    },
  },
  "financial-advisors-liechtenstein": {
    slug: "financial-advisors-liechtenstein",
    title: "Financial Advisors in Liechtenstein | Folksmint",
    description: "Find verified financial advisors in Liechtenstein on Folksmint.",
    filters: {
      country: "Liechtenstein",
      
    },
  },
  "financial-advisors-lithuania": {
    slug: "financial-advisors-lithuania",
    title: "Financial Advisors in Lithuania | Folksmint",
    description: "Find verified financial advisors in Lithuania on Folksmint.",
    filters: {
      country: "Lithuania",
      
    },
  },
  "financial-advisors-luxembourg": {
    slug: "financial-advisors-luxembourg",
    title: "Financial Advisors in Luxembourg | Folksmint",
    description: "Find verified financial advisors in Luxembourg on Folksmint.",
    filters: {
      country: "Luxembourg",
      
    },
  },
  "financial-advisors-madagascar": {
    slug: "financial-advisors-madagascar",
    title: "Financial Advisors in Madagascar | Folksmint",
    description: "Find verified financial advisors in Madagascar on Folksmint.",
    filters: {
      country: "Madagascar",
      
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
  "financial-advisors-malawi": {
    slug: "financial-advisors-malawi",
    title: "Financial Advisors in Malawi | Folksmint",
    description: "Find verified financial advisors in Malawi on Folksmint.",
    filters: {
      country: "Malawi",
      
    },
  },
  "financial-advisors-malaysia": {
    slug: "financial-advisors-malaysia",
    title: "Financial Advisors in Malaysia | Folksmint",
    description: "Find verified financial advisors in Malaysia on Folksmint.",
    filters: {
      country: "Malaysia",
      
    },
  },
  "financial-advisors-maldives": {
    slug: "financial-advisors-maldives",
    title: "Financial Advisors in Maldives | Folksmint",
    description: "Find verified financial advisors in Maldives on Folksmint.",
    filters: {
      country: "Maldives",
      
    },
  },
  "financial-advisors-mali": {
    slug: "financial-advisors-mali",
    title: "Financial Advisors in Mali | Folksmint",
    description: "Find verified financial advisors in Mali on Folksmint.",
    filters: {
      country: "Mali",
      
    },
  },
  "financial-advisors-malta": {
    slug: "financial-advisors-malta",
    title: "Financial Advisors in Malta | Folksmint",
    description: "Find verified financial advisors in Malta on Folksmint.",
    filters: {
      country: "Malta",
      
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
  "financial-advisors-marshall-islands": {
    slug: "financial-advisors-marshall-islands",
    title: "Financial Advisors in Marshall Islands | Folksmint",
    description: "Find verified financial advisors in Marshall Islands on Folksmint.",
    filters: {
      country: "Marshall Islands",
      
    },
  },
  "financial-advisors-mauritania": {
    slug: "financial-advisors-mauritania",
    title: "Financial Advisors in Mauritania | Folksmint",
    description: "Find verified financial advisors in Mauritania on Folksmint.",
    filters: {
      country: "Mauritania",
      
    },
  },
  "financial-advisors-mauritius": {
    slug: "financial-advisors-mauritius",
    title: "Financial Advisors in Mauritius | Folksmint",
    description: "Find verified financial advisors in Mauritius on Folksmint.",
    filters: {
      country: "Mauritius",
      
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
  "financial-advisors-mexico": {
    slug: "financial-advisors-mexico",
    title: "Financial Advisors in Mexico | Folksmint",
    description: "Find verified financial advisors in Mexico on Folksmint.",
    filters: {
      country: "Mexico",
      
    },
  },
  "financial-advisors-micronesia": {
    slug: "financial-advisors-micronesia",
    title: "Financial Advisors in Micronesia | Folksmint",
    description: "Find verified financial advisors in Micronesia on Folksmint.",
    filters: {
      country: "Micronesia",
      
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
  "financial-advisors-moldova": {
    slug: "financial-advisors-moldova",
    title: "Financial Advisors in Moldova | Folksmint",
    description: "Find verified financial advisors in Moldova on Folksmint.",
    filters: {
      country: "Moldova",
      
    },
  },
  "financial-advisors-monaco": {
    slug: "financial-advisors-monaco",
    title: "Financial Advisors in Monaco | Folksmint",
    description: "Find verified financial advisors in Monaco on Folksmint.",
    filters: {
      country: "Monaco",
      
    },
  },
  "financial-advisors-mongolia": {
    slug: "financial-advisors-mongolia",
    title: "Financial Advisors in Mongolia | Folksmint",
    description: "Find verified financial advisors in Mongolia on Folksmint.",
    filters: {
      country: "Mongolia",
      
    },
  },
  "financial-advisors-montenegro": {
    slug: "financial-advisors-montenegro",
    title: "Financial Advisors in Montenegro | Folksmint",
    description: "Find verified financial advisors in Montenegro on Folksmint.",
    filters: {
      country: "Montenegro",
      
    },
  },
  "financial-advisors-morocco": {
    slug: "financial-advisors-morocco",
    title: "Financial Advisors in Morocco | Folksmint",
    description: "Find verified financial advisors in Morocco on Folksmint.",
    filters: {
      country: "Morocco",
      
    },
  },
  "financial-advisors-mozambique": {
    slug: "financial-advisors-mozambique",
    title: "Financial Advisors in Mozambique | Folksmint",
    description: "Find verified financial advisors in Mozambique on Folksmint.",
    filters: {
      country: "Mozambique",
      
    },
  },
  "financial-advisors-myanmar": {
    slug: "financial-advisors-myanmar",
    title: "Financial Advisors in Myanmar | Folksmint",
    description: "Find verified financial advisors in Myanmar on Folksmint.",
    filters: {
      country: "Myanmar",
      
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
  "financial-advisors-namibia": {
    slug: "financial-advisors-namibia",
    title: "Financial Advisors in Namibia | Folksmint",
    description: "Find verified financial advisors in Namibia on Folksmint.",
    filters: {
      country: "Namibia",
      
    },
  },
  "financial-advisors-nauru": {
    slug: "financial-advisors-nauru",
    title: "Financial Advisors in Nauru | Folksmint",
    description: "Find verified financial advisors in Nauru on Folksmint.",
    filters: {
      country: "Nauru",
      
    },
  },
  "financial-advisors-nepal": {
    slug: "financial-advisors-nepal",
    title: "Financial Advisors in Nepal | Folksmint",
    description: "Find verified financial advisors in Nepal on Folksmint.",
    filters: {
      country: "Nepal",
      
    },
  },
  "financial-advisors-netherlands": {
    slug: "financial-advisors-netherlands",
    title: "Financial Advisors in Netherlands | Folksmint",
    description: "Find verified financial advisors in Netherlands on Folksmint.",
    filters: {
      country: "Netherlands",
      
    },
  },
  "financial-advisors-new-zealand": {
    slug: "financial-advisors-new-zealand",
    title: "Financial Advisors in New Zealand | Folksmint",
    description: "Find verified financial advisors in New Zealand on Folksmint.",
    filters: {
      country: "New Zealand",
      
    },
  },
  "financial-advisors-nicaragua": {
    slug: "financial-advisors-nicaragua",
    title: "Financial Advisors in Nicaragua | Folksmint",
    description: "Find verified financial advisors in Nicaragua on Folksmint.",
    filters: {
      country: "Nicaragua",
      
    },
  },
  "financial-advisors-niger": {
    slug: "financial-advisors-niger",
    title: "Financial Advisors in Niger | Folksmint",
    description: "Find verified financial advisors in Niger on Folksmint.",
    filters: {
      country: "Niger",
      
    },
  },
  "financial-advisors-nigeria": {
    slug: "financial-advisors-nigeria",
    title: "Financial Advisors in Nigeria | Folksmint",
    description: "Find verified financial advisors in Nigeria on Folksmint.",
    filters: {
      country: "Nigeria",
      
    },
  },
  "financial-advisors-north-korea": {
    slug: "financial-advisors-north-korea",
    title: "Financial Advisors in North Korea | Folksmint",
    description: "Find verified financial advisors in North Korea on Folksmint.",
    filters: {
      country: "North Korea",
      
    },
  },
  "financial-advisors-north-macedonia": {
    slug: "financial-advisors-north-macedonia",
    title: "Financial Advisors in North Macedonia | Folksmint",
    description: "Find verified financial advisors in North Macedonia on Folksmint.",
    filters: {
      country: "North Macedonia",
      
    },
  },
  "financial-advisors-norway": {
    slug: "financial-advisors-norway",
    title: "Financial Advisors in Norway | Folksmint",
    description: "Find verified financial advisors in Norway on Folksmint.",
    filters: {
      country: "Norway",
      
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
  "financial-advisors-oman": {
    slug: "financial-advisors-oman",
    title: "Financial Advisors in Oman | Folksmint",
    description: "Find verified financial advisors in Oman on Folksmint.",
    filters: {
      country: "Oman",
      
    },
  },
  "financial-advisors-pakistan": {
    slug: "financial-advisors-pakistan",
    title: "Financial Advisors in Pakistan | Folksmint",
    description: "Find verified financial advisors in Pakistan on Folksmint.",
    filters: {
      country: "Pakistan",
      
    },
  },
  "financial-advisors-palau": {
    slug: "financial-advisors-palau",
    title: "Financial Advisors in Palau | Folksmint",
    description: "Find verified financial advisors in Palau on Folksmint.",
    filters: {
      country: "Palau",
      
    },
  },
  "financial-advisors-palestine": {
    slug: "financial-advisors-palestine",
    title: "Financial Advisors in Palestine | Folksmint",
    description: "Find verified financial advisors in Palestine on Folksmint.",
    filters: {
      country: "Palestine",
      
    },
  },
  "financial-advisors-panama": {
    slug: "financial-advisors-panama",
    title: "Financial Advisors in Panama | Folksmint",
    description: "Find verified financial advisors in Panama on Folksmint.",
    filters: {
      country: "Panama",
      
    },
  },
  "financial-advisors-papua-new-guinea": {
    slug: "financial-advisors-papua-new-guinea",
    title: "Financial Advisors in Papua New Guinea | Folksmint",
    description: "Find verified financial advisors in Papua New Guinea on Folksmint.",
    filters: {
      country: "Papua New Guinea",
      
    },
  },
  "financial-advisors-paraguay": {
    slug: "financial-advisors-paraguay",
    title: "Financial Advisors in Paraguay | Folksmint",
    description: "Find verified financial advisors in Paraguay on Folksmint.",
    filters: {
      country: "Paraguay",
      
    },
  },
  "financial-advisors-peru": {
    slug: "financial-advisors-peru",
    title: "Financial Advisors in Peru | Folksmint",
    description: "Find verified financial advisors in Peru on Folksmint.",
    filters: {
      country: "Peru",
      
    },
  },
  "financial-advisors-philippines": {
    slug: "financial-advisors-philippines",
    title: "Financial Advisors in Philippines | Folksmint",
    description: "Find verified financial advisors in Philippines on Folksmint.",
    filters: {
      country: "Philippines",
      
    },
  },
  "financial-advisors-poland": {
    slug: "financial-advisors-poland",
    title: "Financial Advisors in Poland | Folksmint",
    description: "Find verified financial advisors in Poland on Folksmint.",
    filters: {
      country: "Poland",
      
    },
  },
  "financial-advisors-portugal": {
    slug: "financial-advisors-portugal",
    title: "Financial Advisors in Portugal | Folksmint",
    description: "Find verified financial advisors in Portugal on Folksmint.",
    filters: {
      country: "Portugal",
      
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
  "financial-advisors-qatar": {
    slug: "financial-advisors-qatar",
    title: "Financial Advisors in Qatar | Folksmint",
    description: "Find verified financial advisors in Qatar on Folksmint.",
    filters: {
      country: "Qatar",
      
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
  "financial-advisors-romania": {
    slug: "financial-advisors-romania",
    title: "Financial Advisors in Romania | Folksmint",
    description: "Find verified financial advisors in Romania on Folksmint.",
    filters: {
      country: "Romania",
      
    },
  },
  "financial-advisors-russia": {
    slug: "financial-advisors-russia",
    title: "Financial Advisors in Russia | Folksmint",
    description: "Find verified financial advisors in Russia on Folksmint.",
    filters: {
      country: "Russia",
      
    },
  },
  "financial-advisors-rwanda": {
    slug: "financial-advisors-rwanda",
    title: "Financial Advisors in Rwanda | Folksmint",
    description: "Find verified financial advisors in Rwanda on Folksmint.",
    filters: {
      country: "Rwanda",
      
    },
  },
  "financial-advisors-saint-kitts-and-nevis": {
    slug: "financial-advisors-saint-kitts-and-nevis",
    title: "Financial Advisors in Saint Kitts and Nevis | Folksmint",
    description: "Find verified financial advisors in Saint Kitts and Nevis on Folksmint.",
    filters: {
      country: "Saint Kitts and Nevis",
      
    },
  },
  "financial-advisors-saint-lucia": {
    slug: "financial-advisors-saint-lucia",
    title: "Financial Advisors in Saint Lucia | Folksmint",
    description: "Find verified financial advisors in Saint Lucia on Folksmint.",
    filters: {
      country: "Saint Lucia",
      
    },
  },
  "financial-advisors-saint-vincent-and-the-grenadines": {
    slug: "financial-advisors-saint-vincent-and-the-grenadines",
    title: "Financial Advisors in Saint Vincent and the Grenadines | Folksmint",
    description: "Find verified financial advisors in Saint Vincent and the Grenadines on Folksmint.",
    filters: {
      country: "Saint Vincent and the Grenadines",
      
    },
  },
  "financial-advisors-samoa": {
    slug: "financial-advisors-samoa",
    title: "Financial Advisors in Samoa | Folksmint",
    description: "Find verified financial advisors in Samoa on Folksmint.",
    filters: {
      country: "Samoa",
      
    },
  },
  "financial-advisors-san-marino": {
    slug: "financial-advisors-san-marino",
    title: "Financial Advisors in San Marino | Folksmint",
    description: "Find verified financial advisors in San Marino on Folksmint.",
    filters: {
      country: "San Marino",
      
    },
  },
  "financial-advisors-sao-tome-and-principe": {
    slug: "financial-advisors-sao-tome-and-principe",
    title: "Financial Advisors in Sao Tome and Principe | Folksmint",
    description: "Find verified financial advisors in Sao Tome and Principe on Folksmint.",
    filters: {
      country: "Sao Tome and Principe",
      
    },
  },
  "financial-advisors-saudi-arabia": {
    slug: "financial-advisors-saudi-arabia",
    title: "Financial Advisors in Saudi Arabia | Folksmint",
    description: "Find verified financial advisors in Saudi Arabia on Folksmint.",
    filters: {
      country: "Saudi Arabia",
      
    },
  },
  "financial-advisors-senegal": {
    slug: "financial-advisors-senegal",
    title: "Financial Advisors in Senegal | Folksmint",
    description: "Find verified financial advisors in Senegal on Folksmint.",
    filters: {
      country: "Senegal",
      
    },
  },
  "financial-advisors-serbia": {
    slug: "financial-advisors-serbia",
    title: "Financial Advisors in Serbia | Folksmint",
    description: "Find verified financial advisors in Serbia on Folksmint.",
    filters: {
      country: "Serbia",
      
    },
  },
  "financial-advisors-seychelles": {
    slug: "financial-advisors-seychelles",
    title: "Financial Advisors in Seychelles | Folksmint",
    description: "Find verified financial advisors in Seychelles on Folksmint.",
    filters: {
      country: "Seychelles",
      
    },
  },
  "financial-advisors-sierra-leone": {
    slug: "financial-advisors-sierra-leone",
    title: "Financial Advisors in Sierra Leone | Folksmint",
    description: "Find verified financial advisors in Sierra Leone on Folksmint.",
    filters: {
      country: "Sierra Leone",
      
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
  "financial-advisors-singapore": {
    slug: "financial-advisors-singapore",
    title: "Financial Advisors in Singapore | Folksmint",
    description: "Find verified financial advisors in Singapore on Folksmint.",
    filters: {
      country: "Singapore",
      
    },
  },
  "financial-advisors-slovakia": {
    slug: "financial-advisors-slovakia",
    title: "Financial Advisors in Slovakia | Folksmint",
    description: "Find verified financial advisors in Slovakia on Folksmint.",
    filters: {
      country: "Slovakia",
      
    },
  },
  "financial-advisors-slovenia": {
    slug: "financial-advisors-slovenia",
    title: "Financial Advisors in Slovenia | Folksmint",
    description: "Find verified financial advisors in Slovenia on Folksmint.",
    filters: {
      country: "Slovenia",
      
    },
  },
  "financial-advisors-solomon-islands": {
    slug: "financial-advisors-solomon-islands",
    title: "Financial Advisors in Solomon Islands | Folksmint",
    description: "Find verified financial advisors in Solomon Islands on Folksmint.",
    filters: {
      country: "Solomon Islands",
      
    },
  },
  "financial-advisors-somalia": {
    slug: "financial-advisors-somalia",
    title: "Financial Advisors in Somalia | Folksmint",
    description: "Find verified financial advisors in Somalia on Folksmint.",
    filters: {
      country: "Somalia",
      
    },
  },
  "financial-advisors-south-africa": {
    slug: "financial-advisors-south-africa",
    title: "Financial Advisors in South Africa | Folksmint",
    description: "Find verified financial advisors in South Africa on Folksmint.",
    filters: {
      country: "South Africa",
      
    },
  },
  "financial-advisors-south-korea": {
    slug: "financial-advisors-south-korea",
    title: "Financial Advisors in South Korea | Folksmint",
    description: "Find verified financial advisors in South Korea on Folksmint.",
    filters: {
      country: "South Korea",
      
    },
  },
  "financial-advisors-south-sudan": {
    slug: "financial-advisors-south-sudan",
    title: "Financial Advisors in South Sudan | Folksmint",
    description: "Find verified financial advisors in South Sudan on Folksmint.",
    filters: {
      country: "South Sudan",
      
    },
  },
  "financial-advisors-spain": {
    slug: "financial-advisors-spain",
    title: "Financial Advisors in Spain | Folksmint",
    description: "Find verified financial advisors in Spain on Folksmint.",
    filters: {
      country: "Spain",
      
    },
  },
  "financial-advisors-sri-lanka": {
    slug: "financial-advisors-sri-lanka",
    title: "Financial Advisors in Sri Lanka | Folksmint",
    description: "Find verified financial advisors in Sri Lanka on Folksmint.",
    filters: {
      country: "Sri Lanka",
      
    },
  },
  "financial-advisors-sudan": {
    slug: "financial-advisors-sudan",
    title: "Financial Advisors in Sudan | Folksmint",
    description: "Find verified financial advisors in Sudan on Folksmint.",
    filters: {
      country: "Sudan",
      
    },
  },
  "financial-advisors-suriname": {
    slug: "financial-advisors-suriname",
    title: "Financial Advisors in Suriname | Folksmint",
    description: "Find verified financial advisors in Suriname on Folksmint.",
    filters: {
      country: "Suriname",
      
    },
  },
  "financial-advisors-sweden": {
    slug: "financial-advisors-sweden",
    title: "Financial Advisors in Sweden | Folksmint",
    description: "Find verified financial advisors in Sweden on Folksmint.",
    filters: {
      country: "Sweden",
      
    },
  },
  "financial-advisors-switzerland": {
    slug: "financial-advisors-switzerland",
    title: "Financial Advisors in Switzerland | Folksmint",
    description: "Find verified financial advisors in Switzerland on Folksmint.",
    filters: {
      country: "Switzerland",
      
    },
  },
  "financial-advisors-syria": {
    slug: "financial-advisors-syria",
    title: "Financial Advisors in Syria | Folksmint",
    description: "Find verified financial advisors in Syria on Folksmint.",
    filters: {
      country: "Syria",
      
    },
  },
  "financial-advisors-taiwan": {
    slug: "financial-advisors-taiwan",
    title: "Financial Advisors in Taiwan | Folksmint",
    description: "Find verified financial advisors in Taiwan on Folksmint.",
    filters: {
      country: "Taiwan",
      
    },
  },
  "financial-advisors-tajikistan": {
    slug: "financial-advisors-tajikistan",
    title: "Financial Advisors in Tajikistan | Folksmint",
    description: "Find verified financial advisors in Tajikistan on Folksmint.",
    filters: {
      country: "Tajikistan",
      
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
  "financial-advisors-tanzania": {
    slug: "financial-advisors-tanzania",
    title: "Financial Advisors in Tanzania | Folksmint",
    description: "Find verified financial advisors in Tanzania on Folksmint.",
    filters: {
      country: "Tanzania",
      
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
  "financial-advisors-thailand": {
    slug: "financial-advisors-thailand",
    title: "Financial Advisors in Thailand | Folksmint",
    description: "Find verified financial advisors in Thailand on Folksmint.",
    filters: {
      country: "Thailand",
      
    },
  },
  "financial-advisors-timor-leste": {
    slug: "financial-advisors-timor-leste",
    title: "Financial Advisors in Timor-Leste | Folksmint",
    description: "Find verified financial advisors in Timor-Leste on Folksmint.",
    filters: {
      country: "Timor-Leste",
      
    },
  },
  "financial-advisors-togo": {
    slug: "financial-advisors-togo",
    title: "Financial Advisors in Togo | Folksmint",
    description: "Find verified financial advisors in Togo on Folksmint.",
    filters: {
      country: "Togo",
      
    },
  },
  "financial-advisors-tonga": {
    slug: "financial-advisors-tonga",
    title: "Financial Advisors in Tonga | Folksmint",
    description: "Find verified financial advisors in Tonga on Folksmint.",
    filters: {
      country: "Tonga",
      
    },
  },
  "financial-advisors-trinidad-and-tobago": {
    slug: "financial-advisors-trinidad-and-tobago",
    title: "Financial Advisors in Trinidad and Tobago | Folksmint",
    description: "Find verified financial advisors in Trinidad and Tobago on Folksmint.",
    filters: {
      country: "Trinidad and Tobago",
      
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
  "financial-advisors-tunisia": {
    slug: "financial-advisors-tunisia",
    title: "Financial Advisors in Tunisia | Folksmint",
    description: "Find verified financial advisors in Tunisia on Folksmint.",
    filters: {
      country: "Tunisia",
      
    },
  },
  "financial-advisors-turkey": {
    slug: "financial-advisors-turkey",
    title: "Financial Advisors in Turkey | Folksmint",
    description: "Find verified financial advisors in Turkey on Folksmint.",
    filters: {
      country: "Turkey",
      
    },
  },
  "financial-advisors-turkmenistan": {
    slug: "financial-advisors-turkmenistan",
    title: "Financial Advisors in Turkmenistan | Folksmint",
    description: "Find verified financial advisors in Turkmenistan on Folksmint.",
    filters: {
      country: "Turkmenistan",
      
    },
  },
  "financial-advisors-tuvalu": {
    slug: "financial-advisors-tuvalu",
    title: "Financial Advisors in Tuvalu | Folksmint",
    description: "Find verified financial advisors in Tuvalu on Folksmint.",
    filters: {
      country: "Tuvalu",
      
    },
  },
  "financial-advisors-uganda": {
    slug: "financial-advisors-uganda",
    title: "Financial Advisors in Uganda | Folksmint",
    description: "Find verified financial advisors in Uganda on Folksmint.",
    filters: {
      country: "Uganda",
      
    },
  },
  "financial-advisors-ukraine": {
    slug: "financial-advisors-ukraine",
    title: "Financial Advisors in Ukraine | Folksmint",
    description: "Find verified financial advisors in Ukraine on Folksmint.",
    filters: {
      country: "Ukraine",
      
    },
  },
  "financial-advisors-united-arab-emirates": {
    slug: "financial-advisors-united-arab-emirates",
    title: "Financial Advisors in United Arab Emirates | Folksmint",
    description: "Find verified financial advisors in United Arab Emirates on Folksmint.",
    filters: {
      country: "United Arab Emirates",
      
    },
  },
  "financial-advisors-united-kingdom": {
    slug: "financial-advisors-united-kingdom",
    title: "Financial Advisors in United Kingdom | Folksmint",
    description: "Find verified financial advisors in United Kingdom on Folksmint.",
    filters: {
      country: "United Kingdom",
      
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
  "financial-advisors-uruguay": {
    slug: "financial-advisors-uruguay",
    title: "Financial Advisors in Uruguay | Folksmint",
    description: "Find verified financial advisors in Uruguay on Folksmint.",
    filters: {
      country: "Uruguay",
      
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
  "financial-advisors-uzbekistan": {
    slug: "financial-advisors-uzbekistan",
    title: "Financial Advisors in Uzbekistan | Folksmint",
    description: "Find verified financial advisors in Uzbekistan on Folksmint.",
    filters: {
      country: "Uzbekistan",
      
    },
  },
  "financial-advisors-vanuatu": {
    slug: "financial-advisors-vanuatu",
    title: "Financial Advisors in Vanuatu | Folksmint",
    description: "Find verified financial advisors in Vanuatu on Folksmint.",
    filters: {
      country: "Vanuatu",
      
    },
  },
  "financial-advisors-vatican-city": {
    slug: "financial-advisors-vatican-city",
    title: "Financial Advisors in Vatican City | Folksmint",
    description: "Find verified financial advisors in Vatican City on Folksmint.",
    filters: {
      country: "Vatican City",
      
    },
  },
  "financial-advisors-venezuela": {
    slug: "financial-advisors-venezuela",
    title: "Financial Advisors in Venezuela | Folksmint",
    description: "Find verified financial advisors in Venezuela on Folksmint.",
    filters: {
      country: "Venezuela",
      
    },
  },
  "financial-advisors-vietnam": {
    slug: "financial-advisors-vietnam",
    title: "Financial Advisors in Vietnam | Folksmint",
    description: "Find verified financial advisors in Vietnam on Folksmint.",
    filters: {
      country: "Vietnam",
      
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
  "financial-advisors-yemen": {
    slug: "financial-advisors-yemen",
    title: "Financial Advisors in Yemen | Folksmint",
    description: "Find verified financial advisors in Yemen on Folksmint.",
    filters: {
      country: "Yemen",
      
    },
  },
  "financial-advisors-zambia": {
    slug: "financial-advisors-zambia",
    title: "Financial Advisors in Zambia | Folksmint",
    description: "Find verified financial advisors in Zambia on Folksmint.",
    filters: {
      country: "Zambia",
      
    },
  },
  "financial-advisors-zimbabwe": {
    slug: "financial-advisors-zimbabwe",
    title: "Financial Advisors in Zimbabwe | Folksmint",
    description: "Find verified financial advisors in Zimbabwe on Folksmint.",
    filters: {
      country: "Zimbabwe",
      
    },
  },
};
