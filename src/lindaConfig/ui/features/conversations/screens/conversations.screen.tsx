import type React from "react";
import { Conversations } from "../components";

export const ConversationsScreen: React.FC<{ showChannelBanner: boolean }> = ({ showChannelBanner }) => {
	return <Conversations showChannelBanner={showChannelBanner} />;
};
