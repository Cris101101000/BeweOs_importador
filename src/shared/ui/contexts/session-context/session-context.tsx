import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import type { IAgency } from "src/layout/domain/interfaces/agency.interface";
import type { IUser } from "src/layout/domain/interfaces/user.interface";
import type { ISessionContext } from "./session-context.type";

const SessionContext = createContext<ISessionContext | undefined>(undefined);

export const SessionProvider = ({ children }: { children: ReactNode }) => {
	const [user, setUser] = useState<IUser | null>(null);
	const [agency, setAgency] = useState<IAgency | null>(null);
	const [modulesId, setModulesId] = useState<string[] | null>(null);

	return (
		<SessionContext.Provider
			value={{
				user,
				agency,
				modulesId,
				setUser,
				setAgency,
				setModulesId,
			}}
		>
			{children}
		</SessionContext.Provider>
	);
};

export const useSession = () => {
	const context = useContext(SessionContext);
	if (!context) {
		throw new Error("useSession must be used within a SessionProvider");
	}
	return context;
};
