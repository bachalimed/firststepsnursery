
// import SidebarItem from './SidebarItem.js'
// import { Link } from 'react-router-dom'
// import { BsChevronDown } from "react-icons/bs"

// import { VscDashboard, VscPerson } from "react-icons/vsc"
// import { PiStudent } from "react-icons/pi"
// import { GrUserAdmin, GrTask } from "react-icons/gr"
// import { LuCircleDollarSign, LuSchool, LuMail } from "react-icons/lu"
// import { GiHumanPyramid, GiReceiveMoney, GiPayMoney } from "react-icons/gi"
// import { FaMailBulk } from "react-icons/fa"
// import { SiWebmoney } from "react-icons/si"
// import { SlSettings } from "react-icons/sl"
// import { BiHome } from "react-icons/bi"
// import { RiParentLine } from "react-icons/ri"
// import { IoFileTrayStackedOutline, IoSchoolOutline } from "react-icons/io5"
// import { MdOutlineBusinessCenter } from "react-icons/md"
// import { LiaFileInvoiceDollarSolid } from "react-icons/lia"
// import { FaListCheck } from "react-icons/fa6"
// import { HiMiniArrowsUpDown } from "react-icons/hi2"
// import { TbCreditCardPay, TbLogout } from "react-icons/tb"
// import { MdOutlinePermContactCalendar } from "react-icons/md"
// import { BsQuestionSquare } from "react-icons/bs"
// import { HiOutlineChatAlt } from "react-icons/hi"
// import { PiDotsThreeVerticalLight } from 'react-icons/pi'
// import {sidebarMenuUp} from '../../lib/Consts/SidebarMenu'
// import useAuth from '../../../hooks/useAuth'

// const NavbarSidebarUp = (props) => {	
// 	const {username, userRoles, status1, status2, isEmployee, isManager, isParent, isContentManager, isAnimator, isAcademic, isFinance, isHR, isDesk, isDirector,  isAdmin}=useAuth()
// 	let content 
// 	content =
// 	 (
// 		<ul  className='pt-2 '>
// 			<Link to='/dashboard/'> 
// 				<li className={`text-grey-300 text-sm flex items-center gap-x-4 cursor-pointer p-2 hover:bg-sky-700 rounded-md `}>    
// 				<span className='text-2xl block float-left'  ><VscDashboard/> </span>
// 				<span className={`text-base font-light flex-1 `} > Dashboard</span>
// 				</li >
// 			</Link>
// 			<Link to='/students/'> 
// 				<li className={`text-grey-300 text-sm flex items-center gap-x-4 cursor-pointer p-2 hover:bg-sky-700 rounded-md `}>    
// 				<span className='text-2xl block float-left'  ><PiStudent/> </span>
// 				<span className={`text-base font-light flex-1 `} > Students</span><BsChevronDown/>
// 				</li >
// 			</Link>
// 				<ul>						
// 					<Link to='/students/studentsParents/' className= ''> 
// 					<li className='  text-grey-300 text-sm flex items-center gap-x-4 cursor-pointer p-2 px-5  hover:bg-sky-700 rounded-md '>
// 						<span className='text-1xl block float-left'> <RiParentLine/> </span>
// 						Student & Parents
// 					</li>
// 					</Link>		
// 					<Link to='/students/admissions/' className= ''> 
// 					<li className='  text-grey-300 text-sm flex items-center gap-x-4 cursor-pointer p-2 px-5  hover:bg-sky-700 rounded-md '>
// 						<span className='text-1xl block float-left'> <IoFileTrayStackedOutline/> </span>
// 						Admissions
// 					</li>
// 					</Link>		
// 					<Link to='/students/enrolments/' className= ''> 
// 					<li className='  text-grey-300 text-sm flex items-center gap-x-4 cursor-pointer p-2 px-5  hover:bg-sky-700 rounded-md '>
// 						<span className='text-1xl block float-left'> <FaListCheck/> </span>
// 						Enrolments
// 					</li>
// 					</Link>		
// 				</ul>
// 			<Link to='/Academics/'> 
// 				<li className={`text-grey-300 text-sm flex items-center gap-x-4 cursor-pointer p-2 hover:bg-sky-700 rounded-md `}>    
// 				<span className='text-2xl block float-left'  ><IoSchoolOutline/> </span>
// 				<span className={`text-base font-light flex-1 `} > Academics</span><BsChevronDown/>
// 				</li >
// 			</Link>
// 				<ul>						
// 					<Link to='/academics/schoolPlannings/' className= ''> 
// 					<li className='  text-grey-300 text-sm flex items-center gap-x-4 cursor-pointer p-2 px-5  hover:bg-sky-700 rounded-md '>
// 						<span className='text-1xl block float-left'> <MdOutlineBusinessCenter/> </span>
// 						School Plannings
// 					</li>
// 					</Link>		
// 					<Link to='/academics/nurseryPlannings/' className= ''> 
// 					<li className='  text-grey-300 text-sm flex items-center gap-x-4 cursor-pointer p-2 px-5  hover:bg-sky-700 rounded-md '>
// 						<span className='text-1xl block float-left'> <LuSchool/> </span>
// 						Nursery Plannings
// 					</li>
// 					</Link>		
// 					<Link to='/academics/collectionDrop/' className= ''> 
// 					<li className='  text-grey-300 text-sm flex items-center gap-x-4 cursor-pointer p-2 px-5  hover:bg-sky-700 rounded-md '>
// 						<span className='text-1xl block float-left'> <HiMiniArrowsUpDown/> </span>
// 						Collection&Drop
// 					</li>
// 					</Link>		
// 				</ul>
// 			<Link to='/Finances/'> 
// 				<li className={`text-grey-300 text-sm flex items-center gap-x-4 cursor-pointer p-2 hover:bg-sky-700 rounded-md `}>    
// 				<span className='text-2xl block float-left'  ><LuCircleDollarSign/> </span>
// 				<span className={`text-base font-light flex-1 `} > Finances</span><BsChevronDown/>
// 				</li >
// 			</Link>
// 				<ul>						
// 					<Link to='/finances/invoices/' className= ''> 
// 					<li className='  text-grey-300 text-sm flex items-center gap-x-4 cursor-pointer p-2 px-5  hover:bg-sky-700 rounded-md '>
// 						<span className='text-1xl block float-left'> <LiaFileInvoiceDollarSolid/> </span>
// 						Invoices
// 					</li>
// 					</Link>		
// 					<Link to='/finances/payments/' className= ''> 
// 					<li className='  text-grey-300 text-sm flex items-center gap-x-4 cursor-pointer p-2 px-5  hover:bg-sky-700 rounded-md '>
// 						<span className='text-1xl block float-left'> <GiReceiveMoney/> </span>
// 						Payments
// 					</li>
// 					</Link>		
// 					<Link to='/finances/expenses/' className= ''> 
// 					<li className='  text-grey-300 text-sm flex items-center gap-x-4 cursor-pointer p-2 px-5  hover:bg-sky-700 rounded-md '>
// 						<span className='text-1xl block float-left'> <GiPayMoney/> </span>
// 						Expenses
// 					</li>
// 					</Link>		
// 				</ul>
// 			<Link to='/HR/'> 
// 				<li className={`text-grey-300 text-sm flex items-center gap-x-4 cursor-pointer p-2 hover:bg-sky-700 rounded-md `}>    
// 				<span className='text-2xl block float-left'  ><GiHumanPyramid/> </span>
// 				<span className={`text-base font-light flex-1 `} > HR</span><BsChevronDown/>
// 				</li >
// 			</Link>
// 				<ul>						
// 					<Link to='/hr/employees/' className= ''> 
// 					<li className='  text-grey-300 text-sm flex items-center gap-x-4 cursor-pointer p-2 px-5  hover:bg-sky-700 rounded-md '>
// 						<span className='text-1xl block float-left'> <VscPerson/> </span>
// 						Employees
// 					</li>
// 					</Link>		
// 					<Link to='/hr/payroll/' className= ''> 
// 					<li className='  text-grey-300 text-sm flex items-center gap-x-4 cursor-pointer p-2 px-5  hover:bg-sky-700 rounded-md '>
// 						<span className='text-1xl block float-left'> <TbCreditCardPay/> </span>
// 						Payroll
// 					</li>
// 					</Link>		
// 					<Link to='/hr/leave/' className= ''> 
// 					<li className='  text-grey-300 text-sm flex items-center gap-x-4 cursor-pointer p-2 px-5  hover:bg-sky-700 rounded-md '>
// 						<span className='text-1xl block float-left'> <MdOutlinePermContactCalendar/> </span>
// 						Leave
// 					</li>
// 					</Link>		
// 				</ul>
// 			<Link to='/desk/'> 
// 				<li className={`text-grey-300 text-sm flex items-center gap-x-4 cursor-pointer p-2 hover:bg-sky-700 rounded-md `}>    
// 				<span className='text-2xl block float-left'  ><FaMailBulk/> </span>
// 				<span className={`text-base font-light flex-1 `} > Desk</span><BsChevronDown/>
// 				</li >
// 			</Link>
// 				<ul>						
// 					<Link to='/desk/inquiries/' className= ''> 
// 					<li className='  text-grey-300 text-sm flex items-center gap-x-4 cursor-pointer p-2 px-5  hover:bg-sky-700 rounded-md '>
// 						<span className='text-1xl block float-left'> <BsQuestionSquare/> </span>
// 						Inquiries
// 					</li>
// 					</Link>		
// 					<Link to='/desk/tasks/' className= ''> 
// 					<li className='  text-grey-300 text-sm flex items-center gap-x-4 cursor-pointer p-2 px-5  hover:bg-sky-700 rounded-md '>
// 						<span className='text-1xl block float-left'> <GrTask/> </span>
// 						Tasks
// 					</li>
// 					</Link>		
// 					<Link to='/desk/Chat/' className= ''> 
// 					<li className='  text-grey-300 text-sm flex items-center gap-x-4 cursor-pointer p-2 px-5  hover:bg-sky-700 rounded-md '>
// 						<span className='text-1xl block float-left'> <HiOutlineChatAlt/> </span>
// 						Chat
// 					</li>
// 					</Link>		
// 					<Link to='/desk/mails/' className= ''> 
// 					<li className='  text-grey-300 text-sm flex items-center gap-x-4 cursor-pointer p-2 px-5  hover:bg-sky-700 rounded-md '>
// 						<span className='text-1xl block float-left'> <LuMail/> </span>
// 						Mails
// 					</li>
// 					</Link>		
// 				</ul>
// 			<Link to='/cms/'> 
// 				<li className={`text-grey-300 text-sm flex items-center gap-x-4 cursor-pointer p-2 hover:bg-sky-700 rounded-md `}>    
// 				<span className='text-2xl block float-left'  ><SiWebmoney/> </span>
// 				<span className={`text-base font-light flex-1 `} > CMS</span><BsChevronDown/>
// 				</li >
// 			</Link>
// 			<Link to='/public/'> 
// 				<li className={`text-grey-300 text-sm flex items-center gap-x-4 cursor-pointer p-2 hover:bg-sky-700 rounded-md `}>    
// 				<span className='text-2xl block float-left'  ><BiHome/> </span>
// 				<span className={`text-base font-light flex-1 `} > Public</span><BsChevronDown/>
// 				</li >
// 			</Link>
// 			<Link to='/settings/'> 
// 				<li className={`text-grey-300 text-sm flex items-center gap-x-4 cursor-pointer p-2 hover:bg-sky-700 rounded-md `}>    
// 				<span className='text-2xl block float-left'  ><FaMailBulk/> </span>
// 				<span className={`text-base font-light flex-1 `} > Settings</span><BsChevronDown/>
// 				</li >
// 			</Link>
// 				<ul>						
// 					<Link to='/settings/dashboardSet/' className= ''> 
// 					<li className='  text-grey-300 text-sm flex items-center gap-x-4 cursor-pointer p-2 px-5  hover:bg-sky-700 rounded-md '>
// 						<span className='text-1xl block float-left'> <VscDashboard/> </span>
// 						Dashboard
// 					</li>
// 					</Link>		
// 					<Link to='/settings/studentsSet/' className= ''> 
// 					<li className='  text-grey-300 text-sm flex items-center gap-x-4 cursor-pointer p-2 px-5  hover:bg-sky-700 rounded-md '>
// 						<span className='text-1xl block float-left'> <PiStudent/> </span>
// 						Students
// 					</li>
// 					</Link>		
// 					<Link to='/settings/academicsSet/' className= ''> 
// 					<li className='  text-grey-300 text-sm flex items-center gap-x-4 cursor-pointer p-2 px-5  hover:bg-sky-700 rounded-md '>
// 						<span className='text-1xl block float-left'> <IoSchoolOutline/> </span>
// 						Academics
// 					</li>
// 					</Link>		
// 					<Link to='/settings/financesSet/' className= ''> 
// 					<li className='  text-grey-300 text-sm flex items-center gap-x-4 cursor-pointer p-2 px-5  hover:bg-sky-700 rounded-md '>
// 						<span className='text-1xl block float-left'> <LiaFileInvoiceDollarSolid/> </span>
// 						Finances
// 					</li>
// 					</Link>		
// 					<Link to='/settings/HRSet/' className= ''> 
// 					<li className='  text-grey-300 text-sm flex items-center gap-x-4 cursor-pointer p-2 px-5  hover:bg-sky-700 rounded-md '>
// 						<span className='text-1xl block float-left'> <GiHumanPyramid/> </span>
// 						HR
// 					</li>
// 					</Link>		
// 					<Link to='/settings/deskSet/' className= ''> 
// 					<li className='  text-grey-300 text-sm flex items-center gap-x-4 cursor-pointer p-2 px-5  hover:bg-sky-700 rounded-md '>
// 						<span className='text-1xl block float-left'> <FaMailBulk/> </span>
// 						Desk
// 					</li>
// 					</Link>		
// 					<Link to='/settings/cmsSet/' className= ''> 
// 					<li className='  text-grey-300 text-sm flex items-center gap-x-4 cursor-pointer p-2 px-5  hover:bg-sky-700 rounded-md '>
// 						<span className='text-1xl block float-left'> <SiWebmoney/> </span>
// 						CMS
// 					</li>
// 					</Link>		
// 				</ul>
			
				
// 		 {/* <Link to= {!props.menu.submenu?props.menu.path: null}  className={pathname===props.menu.path? 'text-teal-200':''}>
// 			<li key={props.key} className={`text-grey-300 text-sm flex items-center gap-x-4 cursor-pointer p-2 hover:bg-sky-700 rounded-md ${props.menu.spaced ? "mt-8" : "mt-0" } `}>
// 				<span className='text-2xl block float-left' onClick={()=>props.menu.submenu? props.setOpen(true):null}   >  {props.menu.icon? props.menu.icon:<PiDotsThreeVerticalLight/>}</span>
// 				<span className={`text-base font-light flex-1 ${!props.open && "hidden"} duration-200`} onClick={()=> props.setOpen(!props.open)}> {props.menu.title}</span>
// 				{props.menu.submenu && props.open &&(<BsChevronDown className={`${submenuOpen && "rotate-180"}`} onClick={()=>
// 					setSubmenuOpen(!submenuOpen)}/>
// 				)}
// 			</li>
// 		</Link> */}

// 			{/* <ul>
// 				{props.menu.submenuItems.map((submenuItem, index)=>(
					
// 						<Link to={submenuItem.path} className={pathname===submenuItem.path? 'text-teal-200':''}> 
// 						<li key={index} className={userRoles.some(value => submenuItem.allowedRoles.includes(value))?'  text-grey-300 text-sm flex items-center gap-x-4 cursor-pointer p-2 px-5  hover:bg-sky-700 rounded-md ':'hidden'}>
// 							<span className='text-1xl block float-left'> {submenuItem.icon} </span>
// 							{submenuItem.title}

// 						</li>
// 						</Link>
					
// 				))}
// 			</ul> */}
			



		 
		 
		 
		 
		 
		 
// 		 { sidebarMenuUp.map((menu, index) => <SidebarItem key={index} menu={menu} open={props.open} setOpen={props.setOpen}/>
// 		) }	
// 		</ul>
	



// )
// 	return content
//   }
// export default NavbarSidebarUp