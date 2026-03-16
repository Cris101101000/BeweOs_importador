import {
	Button,
	IconComponent,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	P,
} from "@beweco/aurora-ui";
import type React from "react";
import type { IProblemRuleModalProps } from "../../types/behavior-rule-modal.types";

export const ProblemRuleModal: React.FC<IProblemRuleModalProps> = ({
	isOpen,
	onClose,
	onEdit,
	problem,
}) => {
	const getProblemIcon = () => {
		if (problem.type === "duplicate") {
			return "solar:copy-outline";
		}
		return "solar:document-text-outline";
	};

	const getProblemTitle = () => {
		if (problem.type === "duplicate") {
			return "Regla duplicada";
		}
		return "Descripción vaga";
	};

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			size="lg"
			placement="center"
			hideCloseButton
			scrollBehavior="inside"
		>
			<ModalContent>
				{() => (
					<>
						<ModalHeader className="flex flex-col gap-1">
							<div className="flex items-center gap-3">
								<div className="flex items-center justify-center w-10 h-10 bg-warning-100 rounded-full">
									<IconComponent
										icon={getProblemIcon()}
										size="sm"
										className="text-warning-600"
									/>
								</div>
								<span className="text-warning-900 font-semibold">
									{getProblemTitle()}
								</span>
							</div>
						</ModalHeader>
						<ModalBody>
							<div className="space-y-4">
								{/* Problem Description */}
								<div>
									<P className="text-sm font-medium text-default-900 mb-2">
										Problema detectado:
									</P>
									<P className="text-sm text-default-600">{problem.problem}</P>
								</div>

								{/* Suggestions */}
								<div>
									<P className="text-sm font-medium text-default-900 mb-2">
										Sugerencias:
									</P>
									<P className="text-sm text-default-600">
										{problem.suggestions}
									</P>
								</div>

								{/* Duplicate Rules List */}
								{problem.type === "duplicate" && problem.duplicateRules && (
									<div>
										<P className="text-sm font-medium text-default-900 mb-2">
											Reglas similares encontradas:
										</P>
										<div className="space-y-2">
											{(() => {
												try {
													const duplicateRules = JSON.parse(
														problem.duplicateRules
													);
													return (
														<ul className="list-disc list-inside space-y-1">
															{duplicateRules.map(
																(
																	rule: { id: string; name: string },
																	index: number
																) => (
																	<li
																		key={rule.id || index}
																		className="text-sm text-default-600"
																	>
																		{rule.name}
																	</li>
																)
															)}
														</ul>
													);
												} catch {
													return (
														<P className="text-sm text-default-600">
															{problem.duplicateRules}
														</P>
													);
												}
											})()}
										</div>
									</div>
								)}

								{/* Suggested Examples */}
								{problem.type === "vague" && problem.suggestedExamples && (
									<div>
										<P className="text-sm font-medium text-default-900 mb-2">
											Ejemplos sugeridos:
										</P>
										<div className="space-y-2">
											{(() => {
												try {
													const examples = JSON.parse(
														problem.suggestedExamples
													);
													return (
														<ul className="list-disc list-inside space-y-2">
															{examples.map(
																(example: string, index: number) => (
																	<li
																		key={index}
																		className="text-sm text-default-600"
																	>
																		{example}
																	</li>
																)
															)}
														</ul>
													);
												} catch {
													return (
														<P className="text-sm text-default-600">
															{problem.suggestedExamples}
														</P>
													);
												}
											})()}
										</div>
									</div>
								)}
							</div>
						</ModalBody>
						<ModalFooter>
							<Button
								color="default"
								variant="flat"
								onPress={onClose}
								className="flex-1"
							>
								Cerrar
							</Button>
							<Button
								color="primary"
								onPress={onEdit}
								className="flex-1"
								startContent={
									<IconComponent icon="solar:pen-outline" size="sm" />
								}
							>
								Editar regla
							</Button>
						</ModalFooter>
					</>
				)}
			</ModalContent>
		</Modal>
	);
};

