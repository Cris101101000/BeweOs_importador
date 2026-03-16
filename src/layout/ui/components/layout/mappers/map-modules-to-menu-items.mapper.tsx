import { Chip, IconComponent } from "@beweco/aurora-ui";
import { getModuleIconByModuleId } from "@shared/ui/functions/modules";
import type { IGroup } from "../../../../domain/interfaces/modulo.interface";
import { EnumMenuNavListItem } from "../layout.type";

export const mapModulesToMenuItems = (
	groups: IGroup[],
	t: (key: string) => string
) => {
	return groups.map((group) => {
		return {
			key: group.name,
			title: t(group.name),
			items: group.modules.map((module) => {
				const hasChildren = module.children && module.children.length > 0;
				const hasLabels = module.labels && module.labels.length > 0;
				return {
					key: module.id,
					title: t(module.name),
					href: module.href ?? "#",
					icon: module.icon,
					...(module.icon && {
						startContent: (
							<IconComponent icon={getModuleIconByModuleId(module.id)} />
						),
					}),
					...(hasLabels && {
						endContent: (
							<div className="flex gap-1">
								{module.labels?.map((label) => (
									<Chip
										key={label.id}
										color={label.color}
										size="sm"
										variant="flat"
									>
										{label.title}
									</Chip>
								))}
							</div>
						),
					}),
					...(hasChildren && { type: EnumMenuNavListItem.Nest }),
					items: hasChildren
						? module.children?.map((child) => {
								const childHasLabels = child.labels && child.labels.length > 0;
								return {
									key: child.id,
									title: t(child.name),
									href: child.href ?? "#",
									icon: child.icon,
									...(childHasLabels && {
										endContent: (
											<div className="flex gap-1">
												{child.labels?.map((label) => (
													<Chip
														key={label.id}
														color={label.color}
														size="sm"
														variant="flat"
													>
														{label.title}
													</Chip>
												))}
											</div>
										),
									}),
								};
							})
						: undefined,
				};
			}),
		};
	});
};
