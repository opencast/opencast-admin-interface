import React from "react";
import { useTranslation } from "react-i18next";
import { availableHotkeys } from "../../configs/hotkeysConfig";
import { useHotkeys, useHotkeysContext } from "react-hotkeys-hook";
import { Hotkey } from "react-hotkeys-hook/dist/types";

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
				<div className="modal-content active">
					<div className="modal-body">
						<div className="full-col">
							<p className="hint">{t("HOTKEYS.CHEAT_SHEET.HINT")}</p>
							{/* Repeat table for each key */}
							{Object.entries(availableHotkeys).map(([key, hotkeyGroup]) => (
								<div className="obj tbl-list" key={key}>
									<header>
										{t("HOTKEYS.GROUPS." + key.toUpperCase())}
									</header>
									<table className="main-tbl">
										<tbody>
											{/* Repeat row for each hotkey in group*/}
											{Object.entries(hotkeyGroup).map(
												([key, hotkey]) => (
													<tr key={key} style={{ opacity: !(hotkeys && checkHotkeys(hotkeys, hotkey.sequence)) ? "50%" : "100%"}}>
														<td className="hotkey">
															<p className="combo">
																<span className="chord">
																	{/* repeat for each key in hotkey */}
																	{hotkey.sequence.map((comboKey, key) => (
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
																			hotkey.sequence[
																				hotkey.sequence.length - 1
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
																hotkey.description
															)}
														</td>
													</tr>
												)
											)}
										</tbody>
									</table>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default HotKeyCheatSheet;
