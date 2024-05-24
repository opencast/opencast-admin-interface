import React from "react";
import { connect } from "react-redux";
import {
	deleteComment as deleteOneComment,
	saveComment as saveNewComment,
	updateComment as updateNewComment } from "../../../slices/eventDetailsSlice";
import { updatePages } from "../../../thunks/tableThunks";
import { useAppDispatch } from "../../../store";

/**
 * This component renders the location cells of events in the table view
 */
const EventsNotesCell = ({
// @ts-expect-error TS(7031): Binding element 'row' implicitly has an 'any' type... Remove this comment to see the full error message
	row,
	// @ts-expect-error TS(7031):
	updatePages,
}) => {
	const notesCommentReason = 'EVENTS.EVENTS.DETAILS.COMMENTS.REASONS.ADMINUI_NOTES';

	const dispatch = useAppDispatch();

	// Return early if comments are not loaded yet
	if (!row.comments) {
		return <></>;
	}

	// @ts-expect-error TS(7031):
	const comments = row.comments.filter((comment) => comment.reason === notesCommentReason)

	const createComment = (event: React.FocusEvent<HTMLTextAreaElement>) => {
		if (!event.target.value || !row.id) {
			return;
		}
		dispatch(saveNewComment({eventId: row.id, commentText: event.target.value, commentReason: notesCommentReason}))
		.then(() => {
			updatePages();
		});
	 }

	const updateComment = (event: React.ChangeEvent<HTMLTextAreaElement>, commentId: any) => {
		if (!event.target.value || !row.id || !commentId) {
			return;
		}
		dispatch(updateNewComment({eventId: row.id, commentId, commentText: event.target.value, commentReason: notesCommentReason}))
	}

	const deleteComment = (event: React.FocusEvent<HTMLTextAreaElement>, commentId: any) => {
		if (!row.id || !commentId) {
			return;
		}
		if (event.target.value === "") {
			dispatch(deleteOneComment({eventId: row.id, commentId}))
			.then(() => {
				updatePages();
			});
		}
	}

	return (
		<div className="comment-container">
			{comments.length === 0 &&
				<textarea
					className="textarea"
					onBlur={createComment}
				>
				</textarea>
			}
			{/* @ts-expect-error TS(7031): */}
			{comments.map((comment, key) => (
				<div className="comment" key={key}>
					<hr />
					<textarea
						className="textarea"
						defaultValue={comment.text}
						onChange={e => updateComment(e, comment.id)}
						onBlur={e => deleteComment(e, comment.id)}
					></textarea>
				</div>
			))}
		</div>
	);
};

// Getting state data out of redux store
// @ts-expect-error TS(7006): Parameter 'state' implicitly has an 'any' type.
const mapStateToProps = (state) => ({
	// comments: getComments(state),
});

// Mapping actions to dispatch
// @ts-expect-error TS(7006): Parameter 'dispatch' implicitly has an 'any' type.
const mapDispatchToProps = (dispatch) => ({
	updatePages: () => dispatch(updatePages()),
});

export default connect(mapStateToProps, mapDispatchToProps)(EventsNotesCell);
