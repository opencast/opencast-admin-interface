import { forwardRef, PropsWithChildren, useCallback, useImperativeHandle, useState } from "react";
import ReactDOM from "react-dom";
import { useHotkeys } from "react-hotkeys-hook";
import { availableHotkeys } from "../../../configs/hotkeysConfig";
import { useTranslation } from "react-i18next";
import ButtonLikeAnchor from "../ButtonLikeAnchor";
// TODO: Implement focus trapping
// Attempted to do that with focus-trap-react, but it would not focus
// the correct element in e.g. the new event modal
// import { FocusTrap } from "focus-trap-react";

export type ModalProps = {
	open?: boolean
	// Having this return false will prevent the modal from closing
	closeCallback?: () => boolean
	/** If true, the first element in the modal automatically be focused. If false,
	 * no element is initially focused */
	initialFocus?: false | string
	header: string
	classId: string
	className?: string
};

export type ModalHandle = {
	open: () => void;
	close?: () => void;
	isOpen?: () => boolean;
};

export const Modal = forwardRef<ModalHandle, PropsWithChildren<ModalProps>>(({
	open = false,
	closeCallback,
	header,
	classId,
	className,
	children,
}, ref) => {

	const { t } = useTranslation();

	const [isOpen, setOpen] = useState(open);
	const close = useCallback(() => {
		if (closeCallback !== undefined && !closeCallback()) {
			// Don't close modal
			return;
		}
		setOpen(false);
	}, [closeCallback]);

	useImperativeHandle(ref, () => ({
		isOpen: () => isOpen,
		open: () => setOpen(true),
		close,
	}), [close, isOpen]);

	useHotkeys(
		availableHotkeys.general.CLOSE_MODAL.sequence,
		close,
		{ description: t(availableHotkeys.general.CLOSE_MODAL.description) ?? undefined },
		[ref],
	);

	return ReactDOM.createPortal(
		isOpen &&
			<div>
				<div className="modal-animation modal-overlay" />
				<section
					id={classId}
					className={className ? className : "modal wizard modal-animation"}
				>
					<header>
						<ButtonLikeAnchor
							extraClassName="fa fa-times close-modal"
							onClick={close}
							tabIndex={0}
						/>
						<h2>
							{header}
						</h2>
					</header>

						{children}
				</section>
			</div>,
		document.body,
	);

});
