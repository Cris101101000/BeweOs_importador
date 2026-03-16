export enum EnumOrder {
	// Ascending order
	CreatedAt = "createdAt",
	Name = "name",
	Price = "price",
	Status = "isEnabled",
	CategoryId = "categories",
	UpdatedAt = "updatedAt",
	// Descending order (with - prefix)
	CreatedAtDesc = "-createdAt",
	NameDesc = "-name",
	PriceDesc = "-price",
	StatusDesc = "-isEnabled",
	CategoryIdDesc = "-categories",
	UpdatedAtDesc = "-updatedAt",
}
