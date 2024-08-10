import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import WizardNavigationButtons from "../../../shared/wizard/WizardNavigationButtons";
import { FormikProps } from "formik";
import Notifications from "../../../shared/Notifications";
import { OurNotification, addNotification, removeNotificationByKey, removeNotificationWizardForm } from "../../../../slices/notificationSlice";
import { useAppDispatch, useAppSelector } from "../../../../store";
import { TobiraPage, fetchSeriesDetailsTobiraNew, setErrorTobiraPage, setTobiraPage } from "../../../../slices/seriesSlice";
import { getSeriesTobiraPage, getSeriesTobiraPageError } from "../../../../selectors/seriesSeletctor";
import { NOTIFICATION_CONTEXT } from "../../../../configs/modalConfig";

/**
 * This component renders the theme page for new series in the new series wizard.
 */
type RequiredFormProps = {
	breadcrumbs: TobiraPage[],
	selectedPage: TobiraPage | undefined,
}

const NewTobiraPage = <T extends RequiredFormProps>({
	formik,
	nextPage,
	previousPage,
}: {
	formik: FormikProps<T>,
	nextPage: (values: T) => void,
	previousPage: any //(values: T) => void,
}) => {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();

	const [isValid, setIsValid] = useState(false);
	const [editing, setEditing] = useState(false);

	const error = useAppSelector(state => getSeriesTobiraPageError(state));
	const currentPage = useAppSelector(state => getSeriesTobiraPage(state));

	// Check if valid
	useEffect(() => {
		function check(
			type: OurNotification["type"],
			key: OurNotification["key"],
			context: OurNotification["context"],
			callback: () => boolean
		) {
			var toggle = callback();
			if (toggle) {
				dispatch(addNotification({
					type: type,
					key: key,
					duration: -1,
					parameter: undefined,
					context: context,
					noDuplicates: true,
				}));
			} else {
				dispatch(removeNotificationByKey({key, context}));
			}

			if (toggle && type !== 'info') {
				return false;
			}

			return true;
		}

		var valid = true;

		valid = valid && check('info', 'TOBIRA_OVERRIDE_NAME', NOTIFICATION_CONTEXT, function () {
			return !!formik.values.selectedPage && !!formik.values.selectedPage.title;
		});

		if (!editing) {
			dispatch(removeNotificationWizardForm());
			setIsValid(valid);
			return;
		}

		if (currentPage.children.length === 0) {
			setIsValid(valid);
			return;
		}
		var newPage = currentPage.children[currentPage.children.length - 1];

		valid = valid && check('warning', 'TOBIRA_NO_PATH_SEGMENT', NOTIFICATION_CONTEXT, function () {
			return !newPage.segment;
		});

		valid = valid && check('warning', 'TOBIRA_PATH_SEGMENT_INVALID', NOTIFICATION_CONTEXT, function () {
			return !!newPage.segment && (newPage.segment.length <= 1 || [
				// eslint-disable-next-line no-control-regex
				/[\u0000-\u001F\u007F-\u009F]/u,
				/[\u00A0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000]/u,
				/[<>"[\\\]^`{|}#%/?]/u,
				/^[-+~@_!$&;:.,=*'()]/u
			].some(function (regex) {
				return regex.test(newPage.segment);
			}));
		});

		valid = valid && check('warning', 'TOBIRA_PATH_SEGMENT_UNIQUE', NOTIFICATION_CONTEXT, function () {
			return currentPage.children.some(function (child) {
				return child !== newPage && child.segment === newPage.segment;
			});
		});

		setIsValid(valid);
	}, [currentPage.children, dispatch, editing, formik.values.selectedPage])

	const back = (index: number) => {
		goto(formik.values.breadcrumbs.splice(index)[0]);
	}

	const select = (page: TobiraPage | undefined) => {
		if (!page || !page.new) {
			stopEditing();
		}
		if (!page || formik.values.selectedPage === page) {
			formik.setFieldValue("selectedPage", undefined);
		} else {
			formik.setFieldValue("selectedPage", page);
		}
	}

	const updatePath = (page: TobiraPage, lastSegment: string) => {
		return formik.values.breadcrumbs
		.concat(page).map(function (page) {
			return page.segment;
		})
		.join('/')
		/* eslint-disable */
		.replace(/([^\/]+$)/, lastSegment);
	}

	const goto = (page: TobiraPage) => {
		function goto(page: TobiraPage) {
			select(undefined);
			// setCurrentPage(page);
			dispatch(setTobiraPage(page));
			formik.setFieldValue("breadcrumbs", [...formik.values.breadcrumbs, page]);
		}

		// clearNotifications('series-tobira');
		dispatch(removeNotificationWizardForm());
		setErrorTobiraPage(null);

		if (page.new) {
			goto(page)
		} else {
			//fetch tobira resource
			dispatch(fetchSeriesDetailsTobiraNew(page.path))
		}
	}

	useEffect(() => {
		// After changing to another page
		if ( formik.values.breadcrumbs.length === 0 ||
			(formik.values.breadcrumbs.length > 0 &&
			formik.values.breadcrumbs[formik.values.breadcrumbs.length - 1].path !== currentPage.path)
		) {
			select(undefined);
			formik.setFieldValue("breadcrumbs", [...formik.values.breadcrumbs, currentPage]);
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentPage]);

	const addChild = () => {
		setEditing(true);
		var newPage: TobiraPage = { new: true, children: [],
			title: "",
			path: "",
			subpages: "",
			blocks: [],
			segment: "",
		};
		dispatch(setTobiraPage({ ...currentPage, children: [...currentPage.children, newPage]}));
		select(newPage);
	}

	const stopEditing = () => {
		if (editing) {
			dispatch(setTobiraPage({
				...currentPage,
				children: currentPage.children.filter((_, idx) => idx !== currentPage.children.length - 1)
			}));
		}
		setEditing(false);
	};

	return (
		<>
			<div className="modal-content">
				<div className="modal-body">
					{/* Notifications */}
					<Notifications context="not_corner" />
					<div className="full-col">
						<div className="obj">
							<header className="no-expand">
								{t("EVENTS.SERIES.NEW.TOBIRA.CAPTION")}
							</header>
							<div className="obj-container padded">
								<ul>
									<li>
										<p>{t("EVENTS.SERIES.NEW.TOBIRA.DESCRIPTION")}</p>
										</li>
								</ul>
							</div>
							{ !error && (
								<>
									<div className="obj-container padded">
										<div className="obj">
											<header>
												<span>{t("EVENTS.SERIES.NEW.TOBIRA.SELECT_PAGE")}</span>
											</header>
											<div className="breadcrumb">
												{!!formik.values.breadcrumbs && formik.values.breadcrumbs.map((breadcrumb, key) => (
													<button
														key={key}
														className="button-like-anchor breadcrumb-link"
														onClick={() => back(key)}
													>
														{breadcrumb.segment === '' ? t('EVENTS.SERIES.NEW.TOBIRA.HOMEPAGE') : breadcrumb.title}
													</button>
												))}
											</div>
											<table className="main-tbl highlight-hover">
											<thead>
												<tr>
													{currentPage.children.some(page => !page.blocks?.length)
														&& <th className="small"/>
													}
													<th>
														{
															t(
																"EVENTS.SERIES.NEW.TOBIRA.PAGE_TITLE"
															) /* Title */
														}
													</th>
													<th>
														{
															t(
																"EVENTS.SERIES.NEW.TOBIRA.PATH_SEGMENT"
															) /* Path segment */
														}
													</th>
													<th>
														{
															t(
																"EVENTS.SERIES.NEW.TOBIRA.SUBPAGES"
															) /* Subpages */
														}
													</th>
													{editing && <th />}
												</tr>
											</thead>
											<tbody>
											{!!currentPage.children &&
													currentPage.children.map((page, key) => (
														<tr key={key}>
															{currentPage.children.some(page => !page.blocks?.length) && <td>
																{!page.blocks?.length && <input
																	type="checkbox"
																	checked={isValid && formik.values.selectedPage?.path
																		=== currentPage.children[key].path
																	}
																	onChange={() => page.blocks?.length || select(page)}
																/>}
															</td>}
															<td>
																{!!page.new ? (
																	<input
																		placeholder={t('EVENTS.SERIES.NEW.TOBIRA.PAGE_TITLE')}
																		value={page.title}
																		onChange={(e) =>
																			dispatch(setTobiraPage({
																				...currentPage,
																				children: currentPage.children.map((p, k) => {
																								if (k === key) {
																									let newPage = {
																										...p,
																										title: e.target.value,
																									}

																									formik.setFieldValue("selectedPage", newPage)

																									return newPage;
																								}
																								return {...p};
																							})
																			}))
																		}
																	>
																	</input>
																) : (
																	<button
																		className={'button-like-anchor ' + (!page.blocks?.length && 'tobira-selectable')}
																		onClick={() => { page.blocks?.length || select(page) }}
																	>
																		{page.title}
																	</button>
																)}
															</td>
															<td>
																<code className="tobira-path">
																	{!!page.new ? (
																		<input
																			placeholder={t('EVENTS.SERIES.NEW.TOBIRA.PATH_SEGMENT')}
																			value={page.segment}
																			onChange={(e) => {
																				const payload = {
																					...currentPage,
																					children: currentPage.children.map((p, k) => {
																							if (k === key) {
																								let newPage = {
																									...p,
																									path: updatePath(p, e.target.value),
																									segment: e.target.value
																								}

																								formik.setFieldValue("selectedPage", newPage)

																								return newPage;
																							}
																							return {...p};
																						})
																				}
																				dispatch(setTobiraPage(payload))
																			}}
																		></input>
																	) : (
																		<span style={{fontWeight: "inherit"}}>{page.segment}</span>
																	)}
																</code>
															</td>
															<td>
																{((!page.new || isValid) && page.title) &&
																<button
																	className="button-like-anchor details-link"
																	onClick={() => goto(page)}
																>
																		{t("EVENTS.SERIES.NEW.TOBIRA.SUBPAGES")}
																</button>
																}
															</td>
																{ editing &&
																<td>
																	{ page.new &&
																		<button
																			onClick={() => select(undefined)}
																			title={t('EVENTS.SERIES.NEW.TOBIRA.CANCEL')}
																			className="button-like-anchor remove"
																		>
																		</button>
																	}
																</td>
																}
														</tr>
													))}
													{ !editing &&
														<tr>
															<td colSpan={3}>
																<button
																	className={"button-like-anchor"}
																	onClick={() => addChild()}
																>
																	+ {t('EVENTS.SERIES.NEW.TOBIRA.ADD_SUBPAGE')}
																</button>
															</td>
														</tr>
													}
												</tbody>
											</table>
										</div>
									</div>

									<div className="obj-container padded">
										{ (!!formik.values.selectedPage && isValid) ? (
											<p>
												{t('EVENTS.SERIES.NEW.TOBIRA.SELECTED_PAGE')}:
												<code className="tobira-path">
													{formik.values.selectedPage.path}
												</code>
											</p>
										) : (
											<p>
												{t("EVENTS.SERIES.NEW.TOBIRA.NO_PAGE_SELECTED")}
											</p>
										)}
										<p>{t("EVENTS.SERIES.NEW.TOBIRA.DIRECT_LINK")}</p>
									</div>
								</>
							)}
						</div>
					</div>
				</div>
			</div>

			{/* Button for navigation to next page and previous page */}
			<WizardNavigationButtons
				formik={formik}
				nextPage={nextPage}
				previousPage={previousPage}
				additionalValidation={!isValid}
			/>
		</>
	);
};

export default NewTobiraPage;
