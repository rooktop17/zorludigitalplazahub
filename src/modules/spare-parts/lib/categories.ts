export interface Category {
  id: string;
  name: { tr: string; en: string };
  icon: string;
  brands: string[];
}

export const categories: Category[] = [
  { id: 'tv', name: { tr: 'Televizyon', en: 'Television' }, icon: 'Tv', brands: ['Samsung', 'LG', 'Sony', 'Philips', 'TCL', 'Hisense', 'Toshiba', 'Panasonic', 'Sharp', 'Vestel', 'Beko', 'Arçelik'] },
  { id: 'ac', name: { tr: 'Klima', en: 'Air Conditioner' }, icon: 'Wind', brands: ['Daikin', 'Mitsubishi', 'Samsung', 'LG', 'Vestel', 'Baymak', 'Arçelik', 'Beko', 'Bosch'] },
  { id: 'fridge', name: { tr: 'Buzdolabı', en: 'Refrigerator' }, icon: 'Refrigerator', brands: ['Samsung', 'LG', 'Bosch', 'Siemens', 'Beko', 'Arçelik', 'Vestel', 'Grundig', 'Whirlpool'] },
  { id: 'washer', name: { tr: 'Çamaşır Makinesi', en: 'Washing Machine' }, icon: 'WashingMachine', brands: ['Samsung', 'LG', 'Bosch', 'Siemens', 'Beko', 'Arçelik', 'Vestel', 'Grundig', 'AEG', 'Whirlpool', 'Miele'] },
  { id: 'dishwasher', name: { tr: 'Bulaşık Makinesi', en: 'Dishwasher' }, icon: 'Utensils', brands: ['Bosch', 'Siemens', 'Beko', 'Arçelik', 'Samsung', 'LG', 'Vestel', 'Whirlpool'] },
  { id: 'oven', name: { tr: 'Fırın & Ocak', en: 'Oven & Stove' }, icon: 'Flame', brands: ['Bosch', 'Siemens', 'Beko', 'Arçelik', 'Samsung', 'Vestel', 'Grundig'] },
  { id: 'microwave', name: { tr: 'Mikrodalga', en: 'Microwave' }, icon: 'Zap', brands: ['Samsung', 'LG', 'Bosch', 'Siemens', 'Beko', 'Arçelik', 'Vestel'] },
  { id: 'coffee', name: { tr: 'Kahve Makinesi', en: 'Coffee Machine' }, icon: 'Coffee', brands: ['Nespresso', 'DeLonghi', 'Philips', 'Bosch', 'Arzum', 'Beko', 'Siemens', 'Jura', 'Breville'] },
  { id: 'vacuum', name: { tr: 'Elektrikli Süpürge', en: 'Vacuum Cleaner' }, icon: 'Fan', brands: ['Dyson', 'Bosch', 'Samsung', 'LG', 'Philips', 'Beko', 'Arçelik', 'Vestel'] },
  { id: 'iron', name: { tr: 'Ütü', en: 'Iron' }, icon: 'Shirt', brands: ['Philips', 'Bosch', 'Tefal', 'Braun', 'Beko', 'Arçelik'] },
  { id: 'dryer', name: { tr: 'Kurutma Makinesi', en: 'Dryer' }, icon: 'Wind', brands: ['Samsung', 'LG', 'Bosch', 'Siemens', 'Beko', 'Arçelik', 'Miele'] },
  { id: 'phone', name: { tr: 'Cep Telefonu', en: 'Mobile Phone' }, icon: 'Smartphone', brands: ['Apple', 'Samsung', 'Xiaomi', 'Huawei', 'Oppo', 'Vivo', 'OnePlus', 'Google'] },
  { id: 'tablet', name: { tr: 'Tablet', en: 'Tablet' }, icon: 'Tablet', brands: ['Apple', 'Samsung', 'Huawei', 'Lenovo', 'Xiaomi'] },
  { id: 'laptop', name: { tr: 'Dizüstü Bilgisayar', en: 'Laptop' }, icon: 'Laptop', brands: ['Apple', 'Lenovo', 'HP', 'Dell', 'Asus', 'Acer', 'MSI', 'Huawei'] },
  { id: 'desktop', name: { tr: 'Masaüstü Bilgisayar', en: 'Desktop' }, icon: 'Monitor', brands: ['Dell', 'HP', 'Lenovo', 'Apple', 'Asus', 'Acer'] },
  { id: 'printer', name: { tr: 'Yazıcı', en: 'Printer' }, icon: 'Printer', brands: ['HP', 'Canon', 'Epson', 'Brother', 'Samsung', 'Xerox'] },
  { id: 'camera', name: { tr: 'Kamera', en: 'Camera' }, icon: 'Camera', brands: ['Canon', 'Nikon', 'Sony', 'Fujifilm', 'Panasonic', 'GoPro'] },
  { id: 'speaker', name: { tr: 'Hoparlör & Ses Sistemi', en: 'Speaker & Audio' }, icon: 'Speaker', brands: ['JBL', 'Bose', 'Sony', 'Harman Kardon', 'Marshall', 'Bang & Olufsen'] },
  { id: 'headphone', name: { tr: 'Kulaklık', en: 'Headphones' }, icon: 'Headphones', brands: ['Apple', 'Sony', 'Bose', 'Samsung', 'JBL', 'Sennheiser'] },
  { id: 'watch', name: { tr: 'Akıllı Saat', en: 'Smartwatch' }, icon: 'Watch', brands: ['Apple', 'Samsung', 'Huawei', 'Xiaomi', 'Garmin', 'Fitbit'] },
  { id: 'gaming', name: { tr: 'Oyun Konsolu', en: 'Gaming Console' }, icon: 'Gamepad2', brands: ['Sony', 'Microsoft', 'Nintendo'] },
  { id: 'router', name: { tr: 'Modem & Router', en: 'Modem & Router' }, icon: 'Wifi', brands: ['TP-Link', 'Asus', 'Netgear', 'Huawei', 'D-Link', 'Linksys'] },
  { id: 'projector', name: { tr: 'Projeksiyon', en: 'Projector' }, icon: 'Projector', brands: ['Epson', 'BenQ', 'ViewSonic', 'LG', 'Samsung', 'Sony'] },
  { id: 'waterheater', name: { tr: 'Şofben & Termosifon', en: 'Water Heater' }, icon: 'Droplets', brands: ['Bosch', 'Baymak', 'DemirDöküm', 'Ariston', 'Vaillant'] },
  { id: 'heater', name: { tr: 'Isıtıcı', en: 'Heater' }, icon: 'Thermometer', brands: ['DeLonghi', 'Dyson', 'Vestel', 'Fakir', 'Bosch'] },
  { id: 'blender', name: { tr: 'Blender & Mutfak Robotu', en: 'Blender & Food Processor' }, icon: 'UtensilsCrossed', brands: ['Philips', 'Bosch', 'Tefal', 'Braun', 'Arzum', 'Beko'] },
  { id: 'toaster', name: { tr: 'Tost & Ekmek Kızartma', en: 'Toaster' }, icon: 'Sandwich', brands: ['Philips', 'Bosch', 'Tefal', 'Arzum', 'Beko', 'DeLonghi'] },
  { id: 'hairdryer', name: { tr: 'Saç Kurutma & Şekillendirici', en: 'Hair Dryer & Styler' }, icon: 'Sparkles', brands: ['Dyson', 'Philips', 'Braun', 'Remington', 'BaByliss', 'GHD'] },
];
