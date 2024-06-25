import { useRef } from "react";
import MuiTooltip, { TooltipProps } from "@mui/material/Tooltip";

export const Tooltip = ({ className, ...props }: TooltipProps) => {
	const positionRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
	const areaRef = useRef<HTMLDivElement>(null);

	return (
		<MuiTooltip
			{...props}
			classes={{ popper: className }}
			arrow
			describeChild
			disableInteractive
			enterDelay={100}
			enterNextDelay={100}
			leaveDelay={150}
			placement="top"
			ref={areaRef}
			onMouseOut={() => (positionRef.current = { x: -9999, y: -9999 })}
			onMouseMove={(event) => (positionRef.current = { x: event.clientX, y: event.clientY })}
			PopperProps={{
				anchorEl: {
					getBoundingClientRect: () => {
						return new DOMRect(
							positionRef.current.x,
							areaRef.current?.getBoundingClientRect().y,
							0,
							positionRef.current.y,
						);
					},
				},
			}}
		/>
	);
};
