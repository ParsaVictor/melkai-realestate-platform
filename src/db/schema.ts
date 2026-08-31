import {
  pgTable,
  serial,
  varchar,
  text,
  integer,
  bigint,
  boolean,
  timestamp,
  real,
  pgEnum,
} from "drizzle-orm/pg-core";

// Enums
export const propertyTypeEnum = pgEnum("property_type", [
  "apartment",
  "villa",
  "office",
  "shop",
  "land",
]);
export const listingTypeEnum = pgEnum("listing_type", [
  "sale",
  "rent",
  "mortgage",
]);
export const propertyStatusEnum = pgEnum("property_status", [
  "available",
  "sold",
  "rented",
  "pending",
]);
export const userRoleEnum = pgEnum("user_role", [
  "admin",
  "agent",
  "owner",
  "resident",
]);

// Properties table
export const properties = pgTable("properties", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  propertyType: propertyTypeEnum("property_type").default("apartment"),
  listingType: listingTypeEnum("listing_type").default("sale"),
  status: propertyStatusEnum("status").default("available"),
  price: bigint("price", { mode: "number" }),
  area: integer("area"),
  bedrooms: integer("bedrooms").default(0),
  bathrooms: integer("bathrooms").default(0),
  floor: integer("floor").default(0),
  totalFloors: integer("total_floors").default(0),
  parking: boolean("parking").default(false),
  elevator: boolean("elevator").default(false),
  storage: boolean("storage").default(false),
  balcony: boolean("balcony").default(false),
  address: text("address"),
  neighborhood: varchar("neighborhood", { length: 100 }),
  city: varchar("city", { length: 100 }).default("تهران"),
  lat: real("lat"),
  lng: real("lng"),
  imageUrl: text("image_url"),
  hasCelebNeighbor: boolean("has_celeb_neighbor").default(false),
  celebName: varchar("celeb_name", { length: 100 }),
  celebProfession: varchar("celeb_profession", { length: 100 }),
  yearBuilt: integer("year_built"),
  featured: boolean("featured").default(false),
  viewCount: integer("view_count").default(0),
  agentName: varchar("agent_name", { length: 100 }),
  agentPhone: varchar("agent_phone", { length: 20 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Buildings table (for management panel)
export const buildings = pgTable("buildings", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  address: text("address"),
  totalUnits: integer("total_units").default(0),
  floors: integer("floors").default(0),
  hasElevator: boolean("has_elevator").default(false),
  hasParking: boolean("has_parking").default(false),
  monthlyCharge: bigint("monthly_charge", { mode: "number" }).default(0),
  adminName: varchar("admin_name", { length: 100 }),
  adminPhone: varchar("admin_phone", { length: 20 }),
  createdAt: timestamp("created_at").defaultNow(),
});

// Residents table
export const residents = pgTable("residents", {
  id: serial("id").primaryKey(),
  buildingId: integer("building_id").references(() => buildings.id),
  name: varchar("name", { length: 100 }).notNull(),
  phone: varchar("phone", { length: 20 }),
  unitNumber: varchar("unit_number", { length: 20 }),
  floor: integer("floor").default(1),
  isPaid: boolean("is_paid").default(false),
  debtAmount: bigint("debt_amount", { mode: "number" }).default(0),
  isActive: boolean("is_active").default(true),
  joinedAt: timestamp("joined_at").defaultNow(),
});

// Announcements table
export const announcements = pgTable("announcements", {
  id: serial("id").primaryKey(),
  buildingId: integer("building_id").references(() => buildings.id),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content"),
  priority: varchar("priority", { length: 20 }).default("normal"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Search logs
export const searchLogs = pgTable("search_logs", {
  id: serial("id").primaryKey(),
  query: text("query"),
  filters: text("filters"),
  resultsCount: integer("results_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export type Property = typeof properties.$inferSelect;
export type Building = typeof buildings.$inferSelect;
export type Resident = typeof residents.$inferSelect;
export type Announcement = typeof announcements.$inferSelect;
