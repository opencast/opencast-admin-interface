import React from "react";
import { connect } from "react-redux";
import { deleteComment, saveComment, updateComment } from "../../../thunks/eventDetailsThunks";
import { updatePages } from "../../../thunks/tableThunks";

/**
 * This component renders the location cells of events in the table view
 */
const EventsNotesCell = ({
// @ts-expect-error TS(7031): Binding element 'row' implicitly has an 'any' type... Remove this comment to see the full error message
	row,
	// @ts-expect-error TS(7031):
	saveNewComment,
	// @ts-expect-error TS(7031):
	updateNewComment,
	// @ts-expect-error TS(7031):
	deleteOneComment,
	// @ts-expect-error TS(7031):
	updatePages,
}) => {
	const notesCommentReason = 'EVENTS.EVENTS.DETAILS.COMMENTS.REASONS.ADMINUI_NOTES';

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
		saveNewComment(row.id, event.target.value, notesCommentReason)
		.then(() => {
			updatePages();
		});
	 }

	const updateComment = (event: React.ChangeEvent<HTMLTextAreaElement>, commentId: any) => {
		if (!event.target.value || !row.id || !commentId) {
			return;
		}
		updateNewComment(row.id, commentId, event.target.value, notesCommentReason)
	}

	const deleteComment = (event: React.FocusEvent<HTMLTextAreaElement>, commentId: any) => {
		if (!row.id || !commentId) {
			return;
		}
		if (event.target.value === "") {
			deleteOneComment(row.id, commentId)
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
	// @ts-expect-error TS(7006): Parameter 'eventId' implicitly has an 'any' type.
	saveNewComment: (eventId, commentText, commentReason) =>
		dispatch(saveComment(eventId, commentText, commentReason)),
	// @ts-expect-error TS(7006): Parameter 'eventId' implicitly has an 'any' type.
	updateNewComment: (eventId, commentId, commentText, commentReason) =>
		dispatch(updateComment(eventId, commentId, commentText, commentReason)),
	// @ts-expect-error TS(7006): Parameter 'eventId' implicitly has an 'any' type.
	deleteOneComment: (eventId, commentId) =>
		dispatch(deleteComment(eventId, commentId)),
	updatePages: () => dispatch(updatePages()),
});

export default connect(mapStateToProps, mapDispatchToProps)(EventsNotesCell);
