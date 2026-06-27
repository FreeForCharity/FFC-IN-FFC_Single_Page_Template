export type Faq = { question: string; answer: string }

// Import CMS-managed FAQs
import faq1 from './faqs/what-is-the-organization-aiming-to-accomplish.json'
import faq2 from './faqs/are-you-really-a-charity.json'

export const faqs: Faq[] = [
  faq1,
  faq2,
  {
    question: "What are the organization's key strategies for making this happen?",
    answer: `FFC assists by paying the full cost of the .org domain name if available. This reduces a charity's direct hard cost instantly and increases adoption of many other formal IT systems at very low cost per charity (~$16.50 per year).

FFC is also employing a premium subscription to Idealist to source additional IT project managers, IT Webmasters, and Graphic designers to expand how many charities we can support at one time, as well as working on partnerships with other charities and technology vendors for additional services not offered by Free For Charity.`,
  },
  {
    question: "What are the organization's capabilities for doing this?",
    answer: `We already have the accounts set up in eNOM to provide enterprise level domain procurement and by using WHMCS with coupon codes specifically for our 501c3 and pre 501c3 organizations we can provision full hosting and domain names automatically without staff input.

For our training programs we help charities navigate through the MS-900 Microsoft training and certification program while pursuing their "Microsoft 365 Grants". We further provide access to the Divi and WPMUDEV website design and maintenance product that each come with their own vendor provided training.`,
  },
  {
    question: "What have and haven't they accomplished so far?",
    answer: `While a lot has been accomplished on the IT hosting side and to a certain degree the IT project management and consulting side, one element of FFC has not even been started. The Free For Charity directory showing services by category that are actually entirely free to non-profits has not been developed yet. There are on the market a number of regional consulting directories traditionally where the consultant is a for-profit entity and pays money to be marketed to other nonprofits. We seek to produce an entirely free directory with unbiased empirical metrics showing what resources are available to nonprofits. By reducing the high cost often several hundred dollars a year to be listed in these directories a broader suite of available high-quality professionals can be made available to the nonprofit community at a national level. However to accomplish this will require additional code and hosting resources that have a hard cost not currently budgeted within the freeforcharity budget. We are seeking grant opportunities to overcome these issues.`,
  },
  {
    question: 'Is there a need for a charity to provide help for charities?',
    answer: `Yes there is a need to provide help for charities in many ways! Free for Charity is not the only ‘charity for charities’ helping to lower your costs. Another great charity showing all the big name things you can get for free or at heavy discounts is TechSoup.org. Even with these other sites many charities and non profits still pay for profit companies to do work every day or buy products at full cost. Some do so without knowing that as a charity they qualify for lower rates or even free services from major companies. Others because it is hard to find the free products needed though the massive amount of paid marketing by well-funded for profit companies.

The Free for Charity services, consultant, and technology products directories seeks to fix this problem with our motto “Decisions should be made by metrics not marketing.”`,
  },
  {
    question: 'Where did the idea come from?',
    answer: `Free for charity was started when the founder first started as a board member on the local children’s museum’s board of directors. In just a few short weeks he uncovered many items the museum was paying for that were free to charities but the museum was paying for anyways.

In addition, for big projects the museum was not following any procurement management procedures at all. Items such as quoting from multiple vendors before a bid or cross leveling the bids for price and quality were not being done.

Other issues found were the reliance on outdated technology because better alternatives were not known to the non IT trained staff.`,
  },
  {
    question: 'Why do charities pay for items they can get for free?',
    answer: `The first reaction to uncovering these issues with the board was anger. The museum was losing or wasting thousands each year; money that could be used to keep admission prices lower and serve more children! After a deeper look it all came back to training and experience. Most charity founders and directors of small and medium charities are trained in the specialty of the charities mission, in this case child education and development. It is unreasonable to expect every charity director to be up to date on all procurement management methods and the technology that supports business and still run the day-to-day mission. This is where free for charity will come in to help your charities projects to thrive.`,
  },
  {
    question: 'Where does Free for Charity come in to help our charity or nonprofit?',
    answer: `Free for Charity will fill these vital roles for non profits and charities saving money for real program expenses. Most small to medium charities do not have the budget for full-time IT staff or business analysts like for profit companies and large charities. This is because grant managers and large donors want to see the lowest cost to “overhead” and don’t always look closely at the results that fall under program expenses.

Because of this common practice by large donors and grant institutions it is actually better for a small charity to waste money due to mismanagement such as by paying for something they could get for free because the item is put on the books as a ‘program expense’ and not questioned. Program expenses do not count against the charity like “overhead” does.

Paying someone on the non program admin staff or the director of the charity to research and call companies for discounts is a labor cost that counts as “overhead” because it helps more than one program. With free for charity doing the work the target charity does not have to claim costs for overhead. Your nonprofit or charity group will gain access to professionals that have more expertise with the common business tasks like researching products to meet the charities needs. Free for Charity will also show you recommended technology and business practices that can save thousands each year.`,
  },
  {
    question: 'How can I tell if we have high overhead? / My charity does not have high overhead!',
    answer: `Free for Charity is all about efficiency. Many charities ‘fix’ this overhead problem by treating all staff as working on / in the programs or pro-rating between them all and hoping they will not get audited. While on paper you show very low overhead the functional effect is still the same. You have high paid staff like a director doing work that should be done by skilled volunteers or technology. Items such as your nonprofit or charity group bookkeeping data entry, or a full-time employee who updates the charity website or nonprofit Facebook page every now and then between front desk tasks.

If you have ever seen a charity with lower than 5% over head this is mostly what is going on. If you have low recorded overhead then your charity is most likely not using experts for tasks and all staff are wearing many hats; most of which they were never trained in.`,
  },
  {
    question: 'How do you provide your program services?',
    answer: `We provide help for charities with efficiency. One element of efficiency is getting the best product at the lowest price. For charities and non profits much more labor can be provided for free by volunteers. Free for Charity does not make your full-time staff take on more and more roles we can fully take over many of these tasks with expert volunteer labor. Business and IT professionals are always seeking to advance their skills while helping out charities. We capture this labor pool (or create it with training programs) and then manage the volunteers for your charities tasks and projects. We can do this at extremely low if not zero cost because of economies of scale, and because most of this work is process or research based and does not have ‘hard’ costs like equipment.`,
  },
  {
    question: 'Are you like Idealist.org or other matching agencies?',
    answer: `Not exactly. That type of charity matches workers with charities but then leaves the management of the work to the individual nonprofit or charity group. Many small and medium charities do not have the time to manage a volunteer or group of volunteers. Even charities with a volunteer coordinator who works with entry-level volunteers may not have the skills to manage highly technical or high-level business volunteers such as those with MBA’s or decades in high-level information technology. This can result in your best volunteers leaving before a project is completed.

Free for Charity will manage both the work and the results of the projects in-house. All you have to do as a charity is to work with your project manager to set expectations and define results at each stage of the project.

We also provide many physical services like nonprofit websites and hosting that are functionally like a product to your charity. We manage all the functions in the background with volunteers. With these other sites you get one person assigned to work your web project and you have no management support once it is done unless that one person stays on as a volunteer permanently. With Free for Charity if your initial volunteer leaves another from the web team still works on your project and keeps your websites running and maintained. This is just one example.`,
  },
  {
    question: 'What do I need to get started?',
    answer: `All you need to do to get free for charity to provide help for your charities mission today is to contact us with some basic information about your charity. We need to know what type of projects that you would like us to look at or undertake. Please fill out the form below and we will be in touch shortly.`,
  },
  {
    question: 'How can you afford to give away free domain names?',
    answer: `As a 501(c)3 charity ourselves we seek individual, business, and grant sources of funding. At current, free for charity has not received a grant specifically for domain names or hosting but uses individual and business contributions to fund this program.`,
  },
  {
    question: 'Where do you get your domain name packages?',
    answer: `We are a registered reseller of eNom domain names. eNom has graciously provided us with a Platinum account to support other non profits providing the lowest cost domain names for a charity of our size. As we get more and more charities into the domain system we expect the costs to freeforchariy.org to drop even further.`,
  },
  {
    question: 'Why do I not see hosting as an option?',
    answer: `We have a large backlog for new sites and support. We try to process at least 1 new charity into the full hosting system per week.

Ways to get in faster
If you already have your 501(c)3 get your free domain from us (https://freeforcharity.org/domains)
If you can provide your own qualified WordPress webmaster you may be moved up in the list.`,
  },
  {
    question:
      'If I am an individual or business and donate money for a domain package to Free for Charity is this tax-deductible?',
    answer: `While any official tax guidance should come from your accountant or other tax advisor Free For Charity is a registered 501(c)(3) organization and donations are tax-deductible. Our IRS designation number (EIN) is 46-2471893. Upon checkout you will receive a receipt to provide to your accountant. Specifically, if you represent a business you can elect to deduct this as an expense versus as a donation depending on the guidance of your tax advisor.`,
  },
]
