import React from "react";
import { useTranslation } from "react-i18next";
import WizardNavigationButtons from "../../../shared/wizard/WizardNavigationButtons";
import { FormikProps } from "formik";

/**
 * This component renders the theme page for new series in the new series wizard.
 */
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

	const error = false;
	const isValid = true;
	const editing = false;
	const selectedPage = "";

	const breadcrumbs = [{
		segment: "",
		title: "Eins title"
	}]

	const targetPages = [{
		title: "Hello",
		path: "Hello but cursive",
		subpages: "Link",
		new: true,
		blocks: [],
		segment: "",
	}, {
		title: "Bye",
		path: "Buh-Bye",
		subpages: "Lonk",
		new: false,
		blocks: [],
		segment: "",
	}]

	const back = (index: number) => {

	}

	const select = (page: any) => {

	}

	const updatePath = (page: any) => {

	}

	const goto = (page: any) => {

	}

	const addChild = () => {

	}

	return (
		<>
			<div className="modal-content">
				<div className="modal-body">
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
													{!!targetPages &&
															targetPages.map((page, key) => (
																<tr key={key}>
																	<td>
																		{!!page.new ? (
																			<input
																				placeholder={t('EVENTS.SERIES.NEW.TOBIRA.PAGE_TITLE')}
																				value={page.title}
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
																					value="page.segment"
																					onChange={() => updatePath(page)}
																				></input>
																			) : (
																				<span>{page.segment}</span>
																			)}
																		</code>
																	</td>
																	<td>
																		{(!page.new || isValid && page.title) &&
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
													{ (!!selectedPage && isValid) && (
														<p>
															{t('EVENTS.SERIES.NEW.TOBIRA.SELECTED_PAGE')}:
															<code className="tobira-path">
																wizard.step.ud.selectedPage.path
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
