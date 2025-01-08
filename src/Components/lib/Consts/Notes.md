1. [] login access to be ensured 
2. [x] login access to be ensured


 notes on system operation

1. if a completely new student, proceed with adding new student, if a studetn already in the system for another year, from studetnsList, select the row and click register.
a dialog will open to Register the studetn by selecting the current year. now the studetn will be visible when we add admission
2. for new admission, the Admission field, will have all months selected except July and August ( summer club months).
3. for a new service, add preferably all months from teh start so that the studetn will be visible for enrolment later.
4. if a studetn is not admitted for a specific month for a service, he will not appear for enrolment for that month. a list of unenrolled studetns is availble to check if studetn s ar enot admitted or not enrolled.
5. invoices are generated automatically from enrolments (filter non invoices enrolment and generte invoice), and then we can make changes to them from the list of invoices. we can only change the due dates and apply discountsbut if we need to change the amount (long term), we need to delte invoice and edit the enrolment and then generate another invoice. but htis wouild need to wait for authorisatin if the amount is less than anchor.
6. discounts are applied directly onteh final price and will appear on the invoice list
7. there is no ppppayment editing, we should remove a payment and create a new payment a again ( avoid changes of past payments)
8. we create a new employee and we can edit employee and choose roles for employee(animator, desk, academic...)
9. studetn document and employee documetns: there should be not editing of document after document have been uploaded, at least no removing.(alert or prevent) because references in the document have been set for documents
10. studetn docuetn edit only works second click?
academic years "1000" use as criteria to query all years data instead of only one selected year
11. payee editing should prevents non admin from removing existing years, they can add year but not remove.
12. expense category: nor removing of previous items, only  admin wiell be allowed, in case previous expenses werer made with that category item
13. studetn adn expenses do not send same error messages from back end , controllers are similar: one needs response.data.message and teh other response.message
 14. enrollments that weere invoiced will not be editable on the list.
 15. for new enrolment, the list of studetn is for any studetn that has any service that have (some) month in one of the services that corresponds to the month selected.
 so for new admissions, select only one month for admission service and other months for any service.
 16. only the manager can edit or delte admission, to keep conttrol of what happens later
 17. once fee is under the anchor value , a flag is raised and it should be authorised by manger, this agreed value will be eth one to invoice
 18. when we admit with less fee than anchor, a flag is generated, and enrolment will take new value even if not authorised, this will be in red in enrolment list
 19. we can change fee during enrolment, or enrolment edit and we consider the final fee a commnet is nneeded in that case.
 20. add faq: if i need to change fee after enrtolment...
 21. a student not enrolled can appear on the sectin list.
 22. when editing a section, if we change studetn a changeflag will be send and a new sectin will be created and the previous have a to date. 
 if an invoice is paid it cannot be edited or deleted (hidden)
 23. payslip can be generated for non active employee because he can be finished and getting paid.
 24. payment of leave is decided and recorded on the leave itself and will not be changed in the payslip
 25. leave given days are given by the nursery and are paid normally, 
 26. pay lsip generated without payday , and after it is approved, it can be paid and we fill the payment date.
 27. sections flag is when we change animator, add ro remove a studetn, this will create a new sectiona dn give sectionTo to the old sectin
 28. sessins will import only one section inside thdata structure because if a studetn is in more than one section, it will be empty scheduler
 29. if studetn still have a section in his atttributes will still be impported insessions aeventhought ehsection is already does not contain him, maybe issue with updating section when we remove from section
 30. if studetnsection is empty for all studetn, the scheduler will have no rows
 31. now only active sections, the studetn will have studetn sections, we ll see the connsequences on other functions