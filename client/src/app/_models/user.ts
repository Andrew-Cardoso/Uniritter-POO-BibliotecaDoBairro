import { Roles } from "../_enums/roles";

export interface User {
	id: number;
	knownAs: string;
	token: string;
	roles: Roles[];
}