'use client'

import { PuffLoader } from 'react-spinners'
import { ThemeToggle } from './theme-toggle'
import { useTheme } from 'next-themes'

const Loader = () => {
	return (
		<div
			className='
        h-[70vh]
        flex
        flex-col
        justify-center
        items-center
      '
		>
			<PuffLoader
				size={100}
				// color={useTheme().theme === 'light' ? '#36d7b7' : '##36d7b7'}
				color='#36d7b7'
			/>
		</div>
	)
}

export default Loader
