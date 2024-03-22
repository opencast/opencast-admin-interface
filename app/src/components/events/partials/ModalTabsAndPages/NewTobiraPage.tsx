import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import WizardNavigationButtons from "../../../shared/wizard/WizardNavigationButtons";
import { FormikProps } from "formik";
import Notifications from "../../../shared/Notifications";
import { OurNotification, addNotification, removeNotificationWizardForm } from "../../../../slices/notificationSlice";
import { useAppDispatch } from "../../../../store";
import { fetchSeriesDetailsTobiraNew } from "../../../../slices/seriesDetailsSlice";

/**
 * This component renders the theme page for new series in the new series wizard.
 */
type TobiraPage = {
	title: string,
	path: string,
	subpages: string,
	new: boolean,
	blocks: any[],
	segment: string,
	children: TobiraPage[]
}

const NewTobiraPage = <T,>({
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

	const [error, setError] = useState(false);
	const [editing, setEditing] = useState(false);
	const [selectedPage, setSelectedPage] = useState<TobiraPage | undefined>({
		title: "Hello",
		path: "Hello but selected",
		subpages: "Link",
		new: true,
		blocks: [],
		segment: "",
		children: [],
	})
	const [currentPage, setCurrentPage] = useState<TobiraPage>({
		title: "Hello",
		path: "Hello but current",
		subpages: "Link",
		new: true,
		blocks: [],
		segment: "",
		children: [{
			title: "Child 1",
			path: "mwahaha",
			subpages: "Link",
			new: true,
			blocks: [],
			segment: "",
			children: []
		}, {
			title: "Child 2",
			path: "nyehehe",
			subpages: "Lonk",
			new: false,
			blocks: [],
			segment: "",
			children: []
		}]
	})
	const [breadcrumbs, setBreadcrumbs] = useState<TobiraPage[]>([{
		title: "BreadCrumb",
		path: "Let's get this bread",
		subpages: "Link",
		new: false,
		blocks: [],
		segment: "Eins segment",
		children: []
	}])


	const isValid = () => {
		var valid = true;
		function check(type: OurNotification["type"], key: OurNotification["key"], context: OurNotification["context"], callback: () => boolean) {
			var toggle = callback();
			if (toggle) {
				dispatch(addNotification({
					type: type,
					key: key,
					duration: -1,
					parameter: null,
					context: context
				}));
			} else {
				dispatch(removeNotificationWizardForm());
			}

			if (toggle && type !== 'info') {
				valid = false;
			}
		}

		check('info', 'TOBIRA_OVERRIDE_NAME', 'series-tobira-existing', function () {
			return !!selectedPage && !!selectedPage.title;
		});

		if (!editing) {
			dispatch(removeNotificationWizardForm());
			return valid;
		}

		var newPage = currentPage.children[currentPage.children.length - 1];

		check('warning', 'TOBIRA_NO_PATH_SEGMENT', 'series-tobira-new', function () {
			return !newPage.segment;
		});

		check('warning', 'TOBIRA_PATH_SEGMENT_INVALID', 'series-tobira-new', function () {
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

		check('warning', 'TOBIRA_PATH_SEGMENT_UNIQUE', 'series-tobira-new', function () {
			return currentPage.children.some(function (child: any) {
				return child !== newPage && child.segment === newPage.segment;
			});
		});

		return valid;
	}

	const back = (index: number) => {
		goto(breadcrumbs.splice(index)[0]);

		toFormik();
	}

	const select = (page: TobiraPage | undefined) => {
		if (!page || !page.new) {
			stopEditing();
		}
		if (!page || selectedPage === page) {
			setSelectedPage(undefined);
		} else {
			setSelectedPage(page);
		}

		toFormik();
	}

	const updatePath = (page: TobiraPage) => {
		return breadcrumbs
		.concat(page).map(function (page) {
			return page.segment;
		})
		.join('/');
	}

	const goto = (page: TobiraPage) => {
		function goto(page: TobiraPage) {
			select(undefined);
			setCurrentPage(page);
			setBreadcrumbs(prevState => [...prevState, page])
		}

		// clearNotifications('series-tobira');
		dispatch(removeNotificationWizardForm());
		setError(false);

		if (page.new) {
			goto(page)
		} else {
			//fetch tobira resource
			dispatch(fetchSeriesDetailsTobiraNew())
			// TODO: Error notifications
		}

		toFormik();
	}

	const addChild = () => {
		setEditing(true);
		var newPage: TobiraPage = { new: true, children: [],
			title: "",
			path: "",
			subpages: "",
			blocks: [],
			segment: "",
		};
		setCurrentPage(prevState => {
			return {
				...prevState,
				children: [...prevState.children, newPage]
			}
		});
		select(newPage);

		toFormik();
	}

	const stopEditing = () => {
		if (editing) {
			setCurrentPage(prevState => {
				return {
					...prevState,
					children: prevState.children.splice(-1)
				}
			});
			// currentPage.children.pop();
		}
		setEditing(false);

		toFormik();
	};

	const toFormik = () => {
		var existingPages: any[] = [];
		var newPages: any[] = [];
		if (selectedPage) {
			breadcrumbs.concat(selectedPage).forEach( function (page) {
				if (page.new) {
					newPages.push({
						name: page.title,
						pathSegment: page.segment,
					});
				} else {
					existingPages.push(page);
				}
			});

			formik.setFieldValue("tobira.parentPagePath", existingPages.pop().path);
			formik.setFieldValue("tobira.newPages", newPages);
		}
	}


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
										{ !error && (
											<>
												<div className="obj">
													<header>
														<span>{t("EVENTS.SERIES.NEW.TOBIRA.SELECT_PAGE")}</span>
													</header>
													<div className="breadcrumb">
														{!!breadcrumbs && breadcrumbs.map((breadcrumb, key) => (
															<button
																key={key}
																className="button-like-anchor breadcrumb-link"
																onClick={() => back(key)}
															>
																{breadcrumb.segment === '' ? t('EVENTS.SERIES.NEW.TOBIRA.HOMEPAGE') : breadcrumb.title}
															</button>
														))}
													</div>
													<table className="main-tbl">
													<thead>
														<tr>
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
														</tr>
													</thead>
													<tbody>
													{!!currentPage &&
															currentPage.children.map((page, key) => (
																<tr key={key}>
																	<td>
																		{!!page.new ? (
																			<input
																				placeholder={t('EVENTS.SERIES.NEW.TOBIRA.PAGE_TITLE')}
																				value={page.title}
																				onChange={(e) => setCurrentPage(prevState => {
																					return {
																						...prevState,
																						children: prevState.children.map((p, k) => {
																							if (k === key) {
																								return {
																									...p,
																									title: e.target.value,
																								}
																							}
																							return {...p};
																						})
																					}
																				})}
																			>
																			</input>
																		) : (
																			<button
																				className={'button-like-anchor tobira-selectable'}
																				onClick={() => {
																					if (page.blocks.length) {
																						select(page)
																					}
																				}}
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
																					onChange={(e) => setCurrentPage(prevState => {
																						return {
																							...prevState,
																							children: prevState.children.map((p, k) => {
																								if (k === key) {
																									p.segment = e.target.value
																									return {
																										...p,
																										path: updatePath(p),
																										segment: e.target.value
																									}
																								}
																								return {...p};
																							})
																						}
																					})}
																				></input>
																			) : (
																				<span>{page.segment}</span>
																			)}
																		</code>
																	</td>
																	<td>
																		{((!page.new || isValid()) && page.title) &&
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
																					ng-click="wizard.step.select(null)"
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

												<div className="obj-container padded">
													{ (!!selectedPage && isValid()) && (
														<p>
															{t('EVENTS.SERIES.NEW.TOBIRA.SELECTED_PAGE')}:
															<code className="tobira-path">
																{selectedPage.path}
															</code>
														</p>
													)}
													{ true && (
														<p>
															{t("EVENTS.SERIES.NEW.TOBIRA.NO_PAGE_SELECTED")}
														</p>
													)}

												</div>
											</>
										)}
									</li>
								</ul>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Button for navigation to next page and previous page */}
			<WizardNavigationButtons
				formik={formik}
				nextPage={nextPage}
				previousPage={previousPage}
			/>
		</>
	);
};

export default NewTobiraPage;
