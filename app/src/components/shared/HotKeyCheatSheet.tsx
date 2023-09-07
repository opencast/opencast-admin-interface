import React from "react";
import { useTranslation } from "react-i18next";
import { availableHotkeys } from "../../configs/hotkeysConfig";

/**
 * This component renders the hotkey cheat sheet showing all available hotkeys
 */
const HotKeyCheatSheet = ({
    close
}: any) => {
	const { t } = useTranslation();

	const handleClose = () => {
		close();
	};

	return (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
		<>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
			<div className="modal-animation modal-overlay" />
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
			<div className="modal modal-animation">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
				<header>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
					<button
						className="button-like-anchor fa fa-times close-modal"
						onClick={() => handleClose()}
					/>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
					<h2>{t("HOTKEYS.CHEAT_SHEET.TITLE")}</h2>
				</header>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
				<div className="modal-content active">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
					<div className="modal-body">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						<div className="full-col">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<p className="hint">{t("HOTKEYS.CHEAT_SHEET.HINT")}</p>
							{/* Repeat table for each key */}
							{Object.keys(availableHotkeys).map((hotkeyGroup, key) => (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
								<div className="obj tbl-list" key={key}>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
									<header>
										{t("HOTKEYS.GROUPS." + hotkeyGroup.toUpperCase())}
									</header>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
									<table className="main-tbl">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
										<tbody>
											{/* Repeat row for each hotkey in group*/}
// @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
											{Object.keys(availableHotkeys[hotkeyGroup]).map(
												(hotkey, key) => (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
													<tr key={key}>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
														<td className="hotkey">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
															<p className="combo">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
																<span className="chord">
																	{/* repeat for each key in hotkey */}
// @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
																	{availableHotkeys[hotkeyGroup][
																		hotkey
// @ts-expect-error TS(7006): Parameter 'comboKey' implicitly has an 'any' type.
																	].combo.map((comboKey, key) => (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
																		<>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
																			<span key={key}>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
																				<span className="key">
																					{t(
																						"HOTKEYS.KEYS." +
																							comboKey.toUpperCase(),
																						comboKey
																					)}
																				</span>
																			</span>
																			{comboKey ===
// @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
																			availableHotkeys[hotkeyGroup][hotkey]
																				.combo[
// @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
																				availableHotkeys[hotkeyGroup][hotkey]
																					.combo.length - 1
																			]
																				? ""
																				: " + "}
																		</>
																	))}
																</span>
															</p>
														</td>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
														<td>
															{t(
// @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
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
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default HotKeyCheatSheet;
