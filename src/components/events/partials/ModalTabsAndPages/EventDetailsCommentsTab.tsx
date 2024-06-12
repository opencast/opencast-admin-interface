import React, { useState, useEffect } from "react";
import {
	getComments,
	getCommentReasons,
	isSavingComment as getIsSavingComment,
	isSavingCommentReply as getIsSavingCommentReply,
} from "../../../../selectors/eventDetailsSelectors";
import Notifications from "../../../shared/Notifications";
import { getUserInformation } from "../../../../selectors/userInfoSelectors";
import { hasAccess } from "../../../../utils/utils";
import DropDown from "../../../shared/DropDown";
import { useAppDispatch, useAppSelector } from "../../../../store";
import {
	fetchComments,
	saveComment as saveNewComment,
	saveCommentReply as saveNewCommentReply,
	deleteComment as deleteOneComment,
	deleteCommentReply,
} from "../../../../slices/eventDetailsSlice";
import { renderValidDate } from "../../../../utils/dateUtils";

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
}) => {
	const dispatch = useAppDispatch();

	const comments = useAppSelector(state => getComments(state));
	const commentReasons = useAppSelector(state => getCommentReasons(state));
	const isSavingComment = useAppSelector(state => getIsSavingComment(state));
	const isSavingCommentReply = useAppSelector(state => getIsSavingCommentReply(state));

	useEffect(() => {
		dispatch(fetchComments(eventId)).then((r: any) => console.info(r));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const [replyToComment, setReplyToComment] = useState(false);
	const [replyCommentId, setReplyCommentId] = useState(null);
	const [originalComment, setOriginalComment] = useState(null);
	const [commentReplyText, setCommentReplyText] = useState("");
	const [commentReplyIsResolved, setCommentReplyIsResolved] = useState(false);

	const [newCommentText, setNewCommentText] = useState("");
	const [commentReason, setCommentReason] = useState("");

	const user = useAppSelector(state => getUserInformation(state));

// @ts-expect-error TS(7006): Parameter 'commentText' implicitly has an 'any' ty... Remove this comment to see the full error message
	const saveComment = (commentText, commentReason) => {
		dispatch(saveNewComment({eventId, commentText, commentReason})).then((successful) => {
			if (successful) {
				dispatch(fetchComments(eventId));
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
		dispatch(saveNewCommentReply({eventId, commentId: originalComment.id, replyText: reply, commentResolved: isResolved})).then(
			(success) => {
				if (success) {
					dispatch(fetchComments(eventId));
					exitReplyMode();
				}
			}
		);
	};

// @ts-expect-error TS(7006): Parameter 'comment' implicitly has an 'any' type.
	const deleteComment = (comment) => {
		dispatch(deleteOneComment({eventId, commentId: comment.id})).then((success) => {
			if (success) {
				dispatch(fetchComments(eventId));
			}
		});
	};

// @ts-expect-error TS(7006): Parameter 'comment' implicitly has an 'any' type.
	const deleteReply = (comment, reply) => {
		dispatch(deleteCommentReply({eventId, commentId: comment.id, replyId: reply.id})).then((success) => {
			if (success) {
				dispatch(fetchComments(eventId));
			}
		});
	};

	// todo: add user and role management
	return (
		<div className="modal-content">
			<div className="modal-body">
				<Notifications context="not-corner" />
				<div className="full-col">
					<div className="obj comments">
						<header>{t(header)}</header>
						<div className="obj-container">
							<div className="comment-container">
								{
									/* all comments listed below each other */
									comments.map((comment, key) => (
										/* one comment */
										<div
											className={`comment ${
												replyCommentId === key ? "active" : ""
											}`}
											key={key}
										>
											<hr />

											{/* details about the comment */}
											<div className="date">
												{t("dateFormats.dateTime.short", {
													dateTime: renderValidDate(comment.creationDate),
												}) || ""}
											</div>
											<h4>{comment.author.name}</h4>
											<span className="category">
												<strong>
													{t("EVENTS.EVENTS.DETAILS.COMMENTS.REASON")}
												</strong>
												:{" " + t(comment.reason) || ""}
											</span>

											{/* comment text */}
											<p>{comment.text}</p>

											{/* links with performable actions for the comment */}
											{hasAccess(
												"ROLE_UI_EVENTS_DETAILS_COMMENTS_DELETE",
												user
											) && (
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
												<button
													onClick={
														() => replyTo(comment, key) /* enters reply mode */
													}
													className="button-like-anchor reply"
												>
													{t("EVENTS.EVENTS.DETAILS.COMMENTS.REPLY")}
												</button>
											)}
											<span
												className="resolve"
												ng-class="{ resolved : comment.resolvedStatus }"
											>
												{t("EVENTS.EVENTS.DETAILS.COMMENTS.RESOLVED")}
											</span>

											{
												/* all replies to this comment listed below each other */
												comment.replies.map((reply, replyKey) => (
													<div className="comment is-reply" key={replyKey}>
														<hr />

														{/* details about the reply and reply text */}
														<div className="date">
															{t("dateFormats.dateTime.short", {
																dateTime: renderValidDate(reply.creationDate),
															}) || ""}
														</div>
														<h4>{reply.author.name}</h4>
														<span className="category">
															<strong>
																{t("EVENTS.EVENTS.DETAILS.COMMENTS.REASON")}
															</strong>
															:{" " + t(comment.reason) || ""}
														</span>
														<p>
															<span>@{comment.author.name}</span> {reply.text}
														</p>

														{/* link for deleting the reply */}
														{hasAccess(
															"ROLE_UI_EVENTS_DETAILS_COMMENTS_DELETE",
															user
														) && (
															<button
																onClick={() =>
// @ts-expect-error TS(2554): Expected 2 arguments, but got 3.
																	deleteReply(comment, reply, replyKey)
																}
																className="button-like-anchor delete"
															>
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
									<form className="add-comment">
										{/* text field */}
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
										<div className="editable">
											<DropDown
												value={commentReason}
												text={t(commentReason)}
												options={Object.entries(commentReasons)}
												type={"comment"}
												required={true}
												handleChange={(element) => {
													if (element) {
														setCommentReason(element.value)
													}
												}}
												placeholder={t(
													"EVENTS.EVENTS.DETAILS.COMMENTS.SELECTPLACEHOLDER"
												)}
												tabIndex={5}
											/>
										</div>

										{/* submit button for comment (only active, if text has been written and a reason has been selected) */}
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
								<form className="add-comment reply">
									{/* text field */}
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

                  {/* 'resolved' checkbox */}
									{hasAccess(
										"ROLE_UI_EVENTS_DETAILS_COMMENTS_RESOLVE",
										user
									) && (
										<>
										  <div className="resolved-checkbox">
                        <input
                          type="checkbox"
                          id="resolved-checkbox"
                          className="ios"
                          onChange={() =>
                            setCommentReplyIsResolved(!commentReplyIsResolved)
                          }
                        />
                        <label>
                          {
                            t(
                              "EVENTS.EVENTS.DETAILS.COMMENTS.RESOLVED"
                            ) /* Resolved */
                          }
                        </label>
                      </div>
										</>
									)}

									{/* cancel button (exits reply mode) */}
									<button className="cancel" onClick={() => exitReplyMode()}>
										{
											t(
												"EVENTS.EVENTS.DETAILS.COMMENTS.CANCEL_REPLY"
											) /* Cancel */
										}
									</button>

                  {/* submit button for comment reply (only active, if text has been written) */}
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
								</form>
							)
						}
					</div>
				</div>
			</div>
		</div>
	);
};

export default EventDetailsCommentsTab;
