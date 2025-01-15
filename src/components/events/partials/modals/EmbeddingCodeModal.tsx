import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getSourceURL } from "../../../../utils/embeddedCodeUtils";
import { useHotkeys } from "react-hotkeys-hook";
import { availableHotkeys } from "../../../../configs/hotkeysConfig";
import ButtonLikeAnchor from "../../../shared/ButtonLikeAnchor";

/**
 * This component renders the embedding code modal
 */
const EmbeddingCodeModal = ({
	close,
	eventId,
}: {
	close: () => void
	eventId: string
}) => {
	const { t } = useTranslation();

	const [textAreaContent, setTextAreaContent] = useState("");
	const [sourceURL, setSourceURL] = useState("");
	const [currentSize, setCurrentSize] = useState("0x0");
	const [showCopySuccess, setCopySuccess] = useState(false);

	useHotkeys(
		availableHotkeys.general.CLOSE_MODAL.sequence,
		() => close(),
		{ description: t(availableHotkeys.general.CLOSE_MODAL.description) ?? undefined },
		[close],
  	);

	useEffect(() => {
		const fetchData = async () => {
			// get source url
			let sourceURL = await getSourceURL();

			setSourceURL(sourceURL);
		};
		fetchData();
	}, []);

	const handleClose = () => {
		close();
	};

	const copy = () => {
		let copyText = document.getElementById("social_embed-textarea") as HTMLTextAreaElement;
		if (copyText) {
			copyText.select();
			document.execCommand("copy");

			setCopySuccess(true);
		}
	};

	const updateTextArea = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		// chosen frame size
		let frameSize = e.currentTarget.textContent;

		if (!frameSize) {
			return;
		}

		// buttons containing possible frame sizes
		let embedSizeButtons = document.getElementsByClassName("embedSizeButton");

		// iterate through embedSizeButtons and mark the chosen size
		if (frameSize) {
			for (let i = 0; i < embedSizeButtons.length; i++) {
				if (frameSize === embedSizeButtons[i].id) {
					embedSizeButtons[i].classList.add("embedSizeButtonSelected");
				} else {
					embedSizeButtons[i].classList.remove("embedSizeButtonSelected");
				}
			}
		}
		// split frameSize to be used in iFrameString
		let size = frameSize.split("x");

		// build whole url
		let url = sourceURL + "/play/" + eventId;
		// code displayed in text area containing the iFrame to copy
		let iFrameString = `<iframe allowfullscreen src="${url}"
			style="border: 0; margin 0;" name="Player" scrolling="no"
			width="${size[0]}" height="${size[1]}"></iframe>`
			.replace(/\s\s+/g, ' ');

		// set state with new inputs
		setTextAreaContent(iFrameString);
		setCurrentSize(frameSize);
		setCopySuccess(false);
	};

	return (
		<>
			<div className="modal-animation modal-overlay" />
			<section className="modal modal-animation" id="embedding-code">
				<header>
					<ButtonLikeAnchor
						extraClassName="fa fa-times close-modal"
						onClick={() => handleClose()}
					/>
					<h2>{t("CONFIRMATIONS.ACTIONS.SHOW.EMBEDDING_CODE")}</h2>
				</header>

				{/* embed size buttons */}
				<div className="embedded-code-boxes">
					<ButtonLikeAnchor
						id="620x349"
						extraClassName="embedSizeButton size_620x349"
						onClick={(e) => updateTextArea(e)}
					>
						<span className="span-embedded-code">620x349</span>
					</ButtonLikeAnchor>
					<ButtonLikeAnchor
						id="540x304"
						extraClassName="embedSizeButton size_540x304"
						onClick={(e) => updateTextArea(e)}
					>
						<span className="span-embedded-code">540x304</span>
					</ButtonLikeAnchor>
					<ButtonLikeAnchor
						id="460x259"
						extraClassName="embedSizeButton size_460x259"
						onClick={(e) => updateTextArea(e)}
					>
						<span className="span-embedded-code">460x259</span>
					</ButtonLikeAnchor>
					<ButtonLikeAnchor
						id="380x214"
						extraClassName="embedSizeButton size_380x214"
						onClick={(e) => updateTextArea(e)}
					>
						<span className="span-embedded-code">380x214</span>
					</ButtonLikeAnchor>
					<ButtonLikeAnchor
						id="300x169"
						extraClassName="embedSizeButton size_300x169"
						onClick={(e) => updateTextArea(e)}
					>
						<span className="span-embedded-code">300x169</span>
					</ButtonLikeAnchor>
				</div>

				<span id="id_video" className="embedded-code-no-visible">
					{eventId}
				</span>

				{/* text area containing current iFrame code to copy*/}
				<div className="embedded-code-video">
					<textarea
						id="social_embed-textarea"
						className="social_embed-textarea embedded-code-textarea"
						rows={2}
						value={textAreaContent}
						cols={1}
					/>
				</div>

				{/* copy confirmation */}
				{showCopySuccess && (
					<div className="copyConfirm" role="alert">
						<span id="copy_confirm_pre">
							{t("CONFIRMATIONS.EMBEDDING_CODE",{size: currentSize})}
						</span>
					</div>
				)}

				{/* copy button */}
				<div className="embedded-code-copy-to-clipboard">
					<div className="btn-container" style={{ marginBottom: "20px" }}>
						<button
							className="cancel-btn"
							style={{ fontSize: "14px" }}
							onClick={() => copy()}
						>
							{t("COPY")}
						</button>
					</div>
				</div>
			</section>
		</>
	);
};

export default EmbeddingCodeModal;
