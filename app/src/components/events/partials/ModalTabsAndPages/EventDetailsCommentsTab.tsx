import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import {
	fetchComments,
	saveComment,
	saveCommentReply,
	deleteComment,
	deleteCommentReply,
} from "../../../../thunks/eventDetailsThunks";
import {
	getComments,
	getCommentReasons,
	isFetchingComments,
	isSavingComment,
	isSavingCommentReply,
} from "../../../../selectors/eventDetailsSelectors";
// @ts-expect-error TS(6142): Module '../../../shared/Notifications' was resolve... Remove this comment to see the full error message
import Notifications from "../../../shared/Notifications";
import { getUserInformation } from "../../../../selectors/userInfoSelectors";
import { hasAccess } from "../../../../utils/utils";
// @ts-expect-error TS(6142): Module '../../../shared/DropDown' was resolved to ... Remove this comment to see the full error message
import DropDown from "../../../shared/DropDown";

/**
 * This component manages the comment tab of the event details modal
 */
const EventDetailsCommentsTab = ({
// @ts-expect-error TS(7031): Binding element 'eventId' implicitly has an 'any' ... Remove this comment to see the full error message
	eventId,
// @ts-expect-error TS(7031): Binding element 'header' implicitly has an 'any' t... Remove this comment to see the full error message
	header,
// @ts-expect-error TS(7031): Binding element 't' implicitly has an 'any' type.
	t,
// @ts-expect-error TS(7031): Binding element 'loadComments' implicitly has an '... Remove this comment to see the full error message
	loadComments,
// @ts-expect-error TS(7031): Binding element 'saveNewComment' implicitly has an... Remove this comment to see the full error message
	saveNewComment,
// @ts-expect-error TS(7031): Binding element 'saveNewCommentReply' implicitly h... Remove this comment to see the full error message
	saveNewCommentReply,
// @ts-expect-error TS(7031): Binding element 'deleteOneComment' implicitly has ... Remove this comment to see the full error message
	deleteOneComment,
// @ts-expect-error TS(7031): Binding element 'deleteCommentReply' implicitly ha... Remove this comment to see the full error message
	deleteCommentReply,
// @ts-expect-error TS(7031): Binding element 'comments' implicitly has an 'any'... Remove this comment to see the full error message
	comments,
// @ts-expect-error TS(7031): Binding element 'isSavingComment' implicitly has a... Remove this comment to see the full error message
	isSavingComment,
// @ts-expect-error TS(7031): Binding element 'isSavingCommentReply' implicitly ... Remove this comment to see the full error message
	isSavingCommentReply,
// @ts-expect-error TS(7031): Binding element 'commentReasons' implicitly has an... Remove this comment to see the full error message
	commentReasons,
// @ts-expect-error TS(7031): Binding element 'user' implicitly has an 'any' typ... Remove this comment to see the full error message
	user,
}) => {
	useEffect(() => {
// @ts-expect-error TS(7006): Parameter 'r' implicitly has an 'any' type.
		loadComments(eventId).then((r) => console.info(r));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const [replyToComment, setReplyToComment] = useState(false);
	const [replyCommentId, setReplyCommentId] = useState(null);
	const [originalComment, setOriginalComment] = useState(null);
	const [commentReplyText, setCommentReplyText] = useState("");
	const [commentReplyIsResolved, setCommentReplyIsResolved] = useState(false);

	const [newCommentText, setNewCommentText] = useState("");
	const [commentReason, setCommentReason] = useState("");

// @ts-expect-error TS(7006): Parameter 'commentText' implicitly has an 'any' ty... Remove this comment to see the full error message
	const saveComment = (commentText, commentReason) => {
// @ts-expect-error TS(7006): Parameter 'successful' implicitly has an 'any' typ... Remove this comment to see the full error message
		saveNewComment(eventId, commentText, commentReason).then((successful) => {
			if (successful) {
				loadComments(eventId);
				setNewCommentText("");
				setCommentReason("");
			}
		});
	};

// @ts-expect-error TS(7006): Parameter 'comment' implicitly has an 'any' type.
	const replyTo = (comment, key) => {
		setReplyToComment(true);
		setReplyCommentId(key);
		setOriginalComment(comment);
	};

	const exitReplyMode = () => {
		setReplyToComment(false);
		setReplyCommentId(null);
		setOriginalComment(null);
		setCommentReplyText("");
		setCommentReplyIsResolved(false);
	};

// @ts-expect-error TS(7006): Parameter 'originalComment' implicitly has an 'any... Remove this comment to see the full error message
	const saveReply = (originalComment, reply, isResolved) => {
		saveNewCommentReply(eventId, originalComment.id, reply, isResolved).then(
// @ts-expect-error TS(7006): Parameter 'success' implicitly has an 'any' type.
			(success) => {
				if (success) {
					loadComments(eventId);
					exitReplyMode();
				}
			}
		);
	};

// @ts-expect-error TS(7006): Parameter 'comment' implicitly has an 'any' type.
	const deleteComment = (comment) => {
// @ts-expect-error TS(7006): Parameter 'success' implicitly has an 'any' type.
		deleteOneComment(eventId, comment.id).then((success) => {
			if (success) {
				loadComments(eventId);
			}
		});
	};

// @ts-expect-error TS(7006): Parameter 'comment' implicitly has an 'any' type.
	const deleteReply = (comment, reply) => {
// @ts-expect-error TS(7006): Parameter 'success' implicitly has an 'any' type.
		deleteCommentReply(eventId, comment.id, reply.id).then((success) => {
			if (success) {
				loadComments(eventId);
			}
		});
	};

	// todo: add user and role management
	return (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
		<div className="modal-content">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
			<div className="modal-body">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
				<Notifications context="not-corner" />
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
				<div className="full-col">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
					<div className="obj comments">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						<header>{t(header)}</header>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						<div className="obj-container">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<div className="comment-container">
								{
									/* all comments listed below each other */
// @ts-expect-error TS(7006): Parameter 'comment' implicitly has an 'any' type.
									comments.map((comment, key) => (
										/* one comment */
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
										<div
											className={`comment ${
												replyCommentId === key ? "active" : ""
											}`}
											key={key}
										>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<hr />

											{/* details about the comment */}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<div className="date">
												{t("dateFormats.dateTime.short", {
													dateTime: new Date(comment.creationDate),
												}) || ""}
											</div>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<h4>{comment.author.name}</h4>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<span className="category">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
												<strong>
													{t("EVENTS.EVENTS.DETAILS.COMMENTS.REASON")}
												</strong>
												:{" " + t(comment.reason) || ""}
											</span>

											{/* comment text */}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<p>{comment.text}</p>

											{/* links with performable actions for the comment */}
											{hasAccess(
												"ROLE_UI_EVENTS_DETAILS_COMMENTS_DELETE",
												user
											) && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
												<button
													onClick={() => deleteComment(comment)}
													className="button-like-anchor delete"
												>
													{t("EVENTS.EVENTS.DETAILS.COMMENTS.DELETE")}
												</button>
											)}
											{hasAccess(
												"ROLE_UI_EVENTS_DETAILS_COMMENTS_REPLY",
												user
											) && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
												<button
													onClick={
														() => replyTo(comment, key) /* enters reply mode */
													}
													className="button-like-anchor reply"
												>
													{t("EVENTS.EVENTS.DETAILS.COMMENTS.REPLY")}
												</button>
											)}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<span
												className="resolve"
												ng-class="{ resolved : comment.resolvedStatus }"
											>
												{t("EVENTS.EVENTS.DETAILS.COMMENTS.RESOLVED")}
											</span>

											{
												/* all replies to this comment listed below each other */
// @ts-expect-error TS(7006): Parameter 'reply' implicitly has an 'any' type.
												comment.replies.map((reply, replyKey) => (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
													<div className="comment is-reply" key={replyKey}>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
														<hr />

														{/* details about the reply and reply text */}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
														<div className="date">
															{t("dateFormats.dateTime.short", {
																dateTime: new Date(reply.creationDate),
															}) || ""}
														</div>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
														<h4>{reply.author.name}</h4>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
														<span className="category">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
															<strong>
																{t("EVENTS.EVENTS.DETAILS.COMMENTS.REASON")}
															</strong>
															:{" " + t(comment.reason) || ""}
														</span>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
														<p>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
															<span>@{comment.author.name}</span> {reply.text}
														</p>

														{/* link for deleting the reply */}
														{hasAccess(
															"ROLE_UI_EVENTS_DETAILS_COMMENTS_DELETE",
															user
														) && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
															<button
																onClick={() =>
// @ts-expect-error TS(2554): Expected 2 arguments, but got 3.
																	deleteReply(comment, reply, replyKey)
																}
																className="button-like-anchor delete"
															>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
																<i className="fa fa-times-circle" />
																{t("EVENTS.EVENTS.DETAILS.COMMENTS.DELETE")}
															</button>
														)}
													</div>
												))
											}
										</div>
									))
								}
							</div>
						</div>

						{
							/* form for writing a comment (not shown, while replying to a comment is active) */
							replyToComment ||
								(hasAccess("ROLE_UI_EVENTS_DETAILS_COMMENTS_CREATE", user) && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
									<form className="add-comment">
										{/* text field */}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
										<textarea
											value={newCommentText}
											onChange={(comment) =>
												setNewCommentText(comment.target.value)
											}
											placeholder={t(
												"EVENTS.EVENTS.DETAILS.COMMENTS.PLACEHOLDER"
											)}
										></textarea>

										{/* drop-down for selecting a reason for the comment */}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
										<div className="editable">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<DropDown
												value={commentReason}
												text={t(commentReason)}
// @ts-expect-error TS(2550): Property 'entries' does not exist on type 'ObjectC... Remove this comment to see the full error message
												options={Object.entries(commentReasons)}
												type={"comment"}
												required={true}
// @ts-expect-error TS(7006): Parameter 'element' implicitly has an 'any' type.
												handleChange={(element) =>
													setCommentReason(element.value)
												}
												placeholder={t(
													"EVENTS.EVENTS.DETAILS.COMMENTS.SELECTPLACEHOLDER"
												)}
												tabIndex={"5"}
											/>
										</div>

										{/* submit button for comment (only active, if text has been written and a reason has been selected) */}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
										<button
											disabled={
												!!(
													!newCommentText.length ||
													newCommentText.length <= 0 ||
													!commentReason.length ||
													commentReason.length <= 0 ||
													isSavingComment
												)
											}
											className={`save green  ${
												!newCommentText.length ||
												newCommentText.length <= 0 ||
												!commentReason.length ||
												commentReason.length <= 0 ||
												isSavingComment
													? "disabled"
													: "false"
											}`}
											onClick={() => saveComment(newCommentText, commentReason)}
										>
											{t("SUBMIT") /* Submit */}
										</button>
									</form>
								))
						}

						{
							/* form for writing a reply to a comment (only shown, while replying to a comment is active) */
							replyToComment && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
								<form className="add-comment reply">
									{/* text field */}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
									<textarea
										value={commentReplyText}
										onChange={(reply) =>
											setCommentReplyText(reply.target.value)
										}
										placeholder={
											t("EVENTS.EVENTS.DETAILS.COMMENTS.REPLY_TO") +
											"@" +
// @ts-expect-error TS(2531): Object is possibly 'null'.
											originalComment.author.name
										}
									></textarea>

									{/* submit button for comment reply (only active, if text has been written) */}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
									<button
										disabled={
											!!(
												!commentReplyText.length ||
												commentReplyText.length <= 0 ||
												isSavingCommentReply
											)
										}
										className={`save green  ${
											!commentReplyText.length ||
											commentReplyText.length <= 0 ||
											isSavingCommentReply
												? "disabled"
												: "false"
										}`}
										onClick={() =>
											saveReply(
												originalComment,
												commentReplyText,
												commentReplyIsResolved
											)
										}
									>
										{t("EVENTS.EVENTS.DETAILS.COMMENTS.REPLY") /* Reply */}
									</button>

									{/* cancel button (exits reply mode) */}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
									<button className="red" onClick={() => exitReplyMode()}>
										{
											t(
												"EVENTS.EVENTS.DETAILS.COMMENTS.CANCEL_REPLY"
											) /* Cancel */
										}
									</button>

									{/* 'resolved' checkbox */}
									{hasAccess(
										"ROLE_UI_EVENTS_DETAILS_COMMENTS_RESOLVE",
										user
									) && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
										<>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<input
												type="checkbox"
												id="resolved-checkbox"
												className="ios"
												onChange={() =>
													setCommentReplyIsResolved(!commentReplyIsResolved)
												}
											/>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<label>
												{
													t(
														"EVENTS.EVENTS.DETAILS.COMMENTS.RESOLVED"
													) /* Resolved */
												}
											</label>
										</>
									)}
								</form>
							)
						}
					</div>
				</div>
			</div>
		</div>
	);
};

// Getting state data out of redux store
// @ts-expect-error TS(7006): Parameter 'state' implicitly has an 'any' type.
const mapStateToProps = (state) => ({
	comments: getComments(state),
	commentReasons: getCommentReasons(state),
	isFetchingComments: isFetchingComments(state),
	isSavingComment: isSavingComment(state),
	isSavingCommentReply: isSavingCommentReply(state),
	user: getUserInformation(state),
});

// Mapping actions to dispatch
// @ts-expect-error TS(7006): Parameter 'dispatch' implicitly has an 'any' type.
const mapDispatchToProps = (dispatch) => ({
// @ts-expect-error TS(7006): Parameter 'eventId' implicitly has an 'any' type.
	loadComments: (eventId) => dispatch(fetchComments(eventId)),
// @ts-expect-error TS(7006): Parameter 'eventId' implicitly has an 'any' type.
	saveNewComment: (eventId, commentText, commentReason) =>
		dispatch(saveComment(eventId, commentText, commentReason)),
// @ts-expect-error TS(7006): Parameter 'eventId' implicitly has an 'any' type.
	saveNewCommentReply: (eventId, commentId, replyText, commentResolved) =>
		dispatch(saveCommentReply(eventId, commentId, replyText, commentResolved)),
// @ts-expect-error TS(7006): Parameter 'eventId' implicitly has an 'any' type.
	deleteOneComment: (eventId, commentId) =>
		dispatch(deleteComment(eventId, commentId)),
// @ts-expect-error TS(7006): Parameter 'eventId' implicitly has an 'any' type.
	deleteCommentReply: (eventId, commentId, replyId) =>
		dispatch(deleteCommentReply(eventId, commentId, replyId)),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(EventDetailsCommentsTab);
