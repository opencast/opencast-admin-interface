import React from "react";
import { useTranslation } from "react-i18next";
import { availableHotkeys } from "../../configs/hotkeysConfig";
import { useHotkeys, useHotkeysContext } from "react-hotkeys-hook";
import { Hotkey } from "react-hotkeys-hook/dist/types";
import ModalContentTable from "./modals/ModalContentTable";

/**
 * This component renders the hotkey cheat sheet showing all available hotkeys
 */
const HotKeyCheatSheet: React.FC<{
	close: () => void,
}> = ({
	close
}) => {
	const { t } = useTranslation();

	useHotkeys(
		availableHotkeys.general.CLOSE_MODAL.sequence,
		() => close(),
		{ description: t(availableHotkeys.general.CLOSE_MODAL.description) ?? undefined },
		[close],
  	);

	const handleClose = () => {
		close();
	};

	const { hotkeys } = useHotkeysContext();

	const checkHotkeys = (hotkeys: readonly Hotkey[], searchkeys: string[]) => {
		for (const hotkey of hotkeys) {
			if (!hotkey.keys) { continue; }
			if (hotkey.keys.length !== searchkeys.length) { continue; }
			if (hotkey.keys.every((element, index) => element === searchkeys[index])) {
				return true;
			}
		}

		return false;
	}

	return (
		<>
			<div className="modal-animation modal-overlay" />
			<div className="modal modal-animation">
				<header>
					<button
						className="button-like-anchor fa fa-times close-modal"
						onClick={() => handleClose()}
					/>
					<h2>{t("HOTKEYS.CHEAT_SHEET.TITLE")}</h2>
				</header>

				<ModalContentTable modalContentClassName="modal-content active">
					<p className="hint">{t("HOTKEYS.CHEAT_SHEET.HINT")}</p>
					{/* Repeat table for each key */}
					{Object.keys(availableHotkeys).map((hotkeyGroup, key) => (
						<div className="obj tbl-list" key={key}>
							<header>
								{t("HOTKEYS.GROUPS." + hotkeyGroup.toUpperCase())}
							</header>
							<table className="main-tbl">
								<tbody>
									{/* Repeat row for each hotkey in group*/}
									{Object.keys(availableHotkeys[hotkeyGroup]).map(
										(hotkey, key) => (
											<tr key={key} style={{ opacity: !(hotkeys && checkHotkeys(hotkeys, availableHotkeys[hotkeyGroup][hotkey].sequence)) ? "50%" : "100%"}}>
												<td className="hotkey">
													<p className="combo">
														<span className="chord">
															{/* repeat for each key in hotkey */}
															{availableHotkeys[hotkeyGroup][
																hotkey
															].sequence.map((comboKey, key) => (
																<span key={key}>
																	<span>
																		<span className="key">
																			{t(
																				"HOTKEYS.KEYS." +
																					comboKey.toUpperCase(),
																				comboKey
																			)}
																		</span>
																	</span>
																	{comboKey ===
																	availableHotkeys[hotkeyGroup][hotkey]
																		.sequence[
																		availableHotkeys[hotkeyGroup][hotkey]
																			.sequence.length - 1
																	]
																		? ""
																		: " + "}
																</span>
															))}
														</span>
													</p>
												</td>
												<td>
													{t(
														availableHotkeys[hotkeyGroup][hotkey]
															.description
													)}
												</td>
											</tr>
										)
									)}
								</tbody>
							</table>
						</div>
					))}
				</ModalContentTable>
			</div>
		</>
	);
};

export default HotKeyCheatSheet;
