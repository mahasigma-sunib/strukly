import React from 'react';
import AddIcon from '../icons/AddIcon';

interface Props {
	activeCount: number;
	onAdd: () => void;
}

const GoalsHeader: React.FC<Props> = ({ activeCount, onAdd }) => {
	return (
		<header className="p-6 bg-white border-b border-slate-100 sticky top-0 z-10">
			<div className="flex justify-between items-center">
				<div>
					<h1 className="text-2xl font-black text-slate-800">Wishlist</h1>
					<p className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md inline-block mt-1">
						{activeCount} ACTIVE TARGETS
					</p>
				</div>
				<button
					onClick={onAdd}
					className="bg-[var(--fun-color-secondary)] p-3 rounded-2xl hover:scale-105 transition-transform flex items-center justify-center"
				>
					<AddIcon width={20} height={20} />
				</button>
			</div>
		</header>
	);
};

export default GoalsHeader;
