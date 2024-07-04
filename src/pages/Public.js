//the public facing webpage when not logged in

import PublicHeader from '../Components/PublicHeader';
import PublicFooter from '../Components/PublicFooter';
// import { Link } from 'react-router-dom';
// import { Outlet } from 'react-router-dom';

const Public = () => {
   const content =(
    	<section className="public">       
    		 <PublicHeader/>    
			<main className="public__main">
			
			<br />
			<p>this is the public page</p>
			</main>    
    		 <PublicFooter/>            
		</section>
	)
	return content
}
export default Public