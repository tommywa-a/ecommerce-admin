import { auth, UserButton } from '@clerk/nextjs'
import { redirect } from 'next/navigation'

import { MainNav } from '@/components/main-nav'
import StoreSwitcher from '@/components/store-switcher'
import prismadb from '@/lib/prismadb'
import { ThemeToggle } from '@/components/theme-toggle'

const Navbar = async () => {
	const { userId } = await auth()

	if (!userId) {
		redirect('/sign-in')
	}

	const stores = await prismadb.store.findMany({
		where: {
			userId,
		},
	})

	return (
		<div className='border-b'>
			<div className='flex h-16 items-center px-4'>
				<StoreSwitcher className='px-1 md:px-4' items={stores} />
				<MainNav className='mx-2 md:mx-4 lg:mx-6 w-32 md:w-full overflow-x-auto ' />
				<div className='ml-auto pr-2 flex items-center space-x-2 md:space-x-4'>
					<ThemeToggle />
					<UserButton afterSignOutUrl='/' />
				</div>
			</div>
		</div>
	)
}

export default Navbar
