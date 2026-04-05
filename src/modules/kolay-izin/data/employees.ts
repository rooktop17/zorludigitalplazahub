import type { Branch } from "@/modules/kolay-izin/types/leave";

export interface Employee {
  id: number;
  fullName: string;
  title?: string;
  branch?: Branch;
  password: string;
  isAdmin: boolean;
  annualLeave: number;
}

export const admins: Employee[] = [
  { id: 903,  fullName: "Halil Kavaz",         password: "halil1",   isAdmin: true,  annualLeave: 14 },
  { id: 7934, fullName: "Deniz Bisikletçiler",  password: "deniz1",   isAdmin: true,  annualLeave: 14 },
];

export const employees: Employee[] = [
  { id: 7929, fullName: "Çisem Özdoğan",        password: "cisem44",   isAdmin: false, annualLeave: 14, title: "Store Manager", branch: "Lefkoşa" },
  { id: 7930, fullName: "Mustafa Özdoğan",      password: "musta55",   isAdmin: false, annualLeave: 14, title: "Sales Representative", branch: "Lefkoşa" },
  { id: 7931, fullName: "Dilfuza Jumakova",     password: "dilfu77",   isAdmin: false, annualLeave: 14, title: "Sales Representative", branch: "Lefkoşa" },
  { id: 7932, fullName: "Serkan Taras",         password: "serka22",   isAdmin: false, annualLeave: 14, title: "Store Manager", branch: "Mağusa" },
  { id: 7936, fullName: "Alaaeddin Erdemci",    password: "alaae33",   isAdmin: false, annualLeave: 14, title: "White Goods Chef" },
  { id: 7937, fullName: "Ramazan Koshayev",     password: "ramaz88",   isAdmin: false, annualLeave: 14 },
  { id: 7938, fullName: "Suhrap Alimov",        password: "suhra66",   isAdmin: false, annualLeave: 14 },
  { id: 7939, fullName: "Çakır Recepov",        password: "cakir11",   isAdmin: false, annualLeave: 14, title: "TV Technician" },
  { id: 7940, fullName: "Bilal Muhammed",       password: "bilal99",   isAdmin: false, annualLeave: 14, title: "TV Technician" },
  { id: 7941, fullName: "Abed Azbaki",          password: "abeda47",   isAdmin: false, annualLeave: 14, title: "Air Conditioning Technician" },
  { id: 7942, fullName: "Umit Rozyev",          password: "umitro36",  isAdmin: false, annualLeave: 14, title: "TV Technician" },
  { id: 9174, fullName: "Karetta",              password: "karet52",   isAdmin: false, annualLeave: 999 },
];

export const allUsers = [...admins, ...employees];

export function findEmployee(name: string): Employee | undefined {
  const clean = name.trim().toLowerCase();
  return allUsers.find((e) => e.fullName.toLowerCase() === clean);
}

export function findEmployeeByPassword(name: string, password: string): Employee | undefined {
  const emp = findEmployee(name);
  if (emp && emp.password === password) return emp;
  return undefined;
}
