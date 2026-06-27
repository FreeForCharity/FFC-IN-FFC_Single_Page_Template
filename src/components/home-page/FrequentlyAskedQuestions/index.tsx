import React from 'react'
import FrequentlyAskedQuestions from '@/components/ui/Frequently-Asked-Questions'

const index = () => {
  return (
    <div id="faq" className="py-[50px]">
      <div className="w-[90%] mx-auto lg:px-[20px]">
        <h2 className="font-[400] text-[40px] lg:text-[48px]  tracking-[0] text-center mx-auto mb-[50px] faustina-font">
          Frequently Asked Questions
        </h2>
        <div>
          <FrequentlyAskedQuestions title="What is the organization aiming to accomplish?">
            <p className="mb-[30px]">
              While in the technical process of setting up free charity hosting we discovered that
              many small or new organizations are stuck well below the need for full web hosting. As
              an example, assistance with setting up a charity email address with Microsoft at the
              charity&apos;s domain name is needed as a first step. FFC has refactored our charity
              on-boarding process to address email and other basic communication needs with free
              guides hosted on our project site ffcdomains.org.
            </p>
            <p>
              As a follow-on need, we identified that most charities and pre 501c3 non-profits do
              not create an email because they fear buying the wrong domain name or do not want to
              pay for a domain name. We now cover these costs and help with buying the domain name
              for supported charities.
            </p>
          </FrequentlyAskedQuestions>
          <FrequentlyAskedQuestions title="What are the organization's key strategies for making this happen?">
            <p className="mb-[30px]">
              FFC assists by paying the full cost of the .org domain name if available. This reduces
              a charity&apos;s direct hard cost instantly and increases adoption of many other
              formal IT systems at very low cost per charity (~$16.50 per year).
            </p>
            <p>
              FFC is also employing a premium subscription to Idealist to source additional IT
              project managers, IT Webmasters, and Graphic designers to expand how many charities we
              can support at one time, as well as working on partnerships with other charities and
              technology vendors for additional services not offered by Free For Charity.
            </p>
          </FrequentlyAskedQuestions>

          <FrequentlyAskedQuestions title="What are the organizations capabilities for doing this?">
            <p className="mb-[30px]">
              We already have the accounts set up in eNOM to provide enterprise level domain
              procurement and by using WHMCS with coupon codes specifically for our 501c3 and pre
              501c3 organizations we can provision full hosting and domain names automatically
              without staff input.
            </p>
            <p>
              For our training programs we help charities navigate through the MS-900 Microsoft
              training and certification program while pursuing their Microsoft 365 Grants. We
              further provide access to the Divi and WPMUDEV website design and maintenance product
              that each come with their own vendor provided training.
            </p>
          </FrequentlyAskedQuestions>

          <FrequentlyAskedQuestions title="What have and havent they accomplished so far?">
            <p>
              While a lot has been accomplished on the IT hosting side and to a certain degree the
              IT project management and consulting side, one element of FFC has not even been
              started. The Free For Charity directory showing services by category that are actually
              entirely free to non-profits has not been developed yet. There are on the market a
              number of regional consulting directories traditionally where the consultant is a
              for-profit entity and pays money to be marketed to other nonprofits. We seek to
              produce an entirely free directory with unbiased empirical metrics showing what
              resources are available to nonprofits. By reducing the high cost often several hundred
              dollars a year to be listed in these directories a broader suite of available
              high-quality professionals can be made available to the nonprofit community at a
              national level. However to accomplish this will require additional code and hosting
              resources that have a hard cost not currently budgeted within the freeforcharity
              budget. We are seeking grant opportunities to overcome these issues.
            </p>
          </FrequentlyAskedQuestions>

          <FrequentlyAskedQuestions title="Is there a need for a charity to provide help for charities?">
            <p className="mb-[30px]">
              Yes there is a need to provide help for charities in many ways! Free for Charity is
              not the only ‘charity for charities’ helping to lower your costs. Another great
              charity showing all the big name things you can get for free or at heavy discounts is 
              <a href="#">TechSoup.org.</a> Even with these other sites many charities and non
              profits still pay for profit companies to do work every day or buy products at full
              cost. Some do so without knowing that as a charity they qualify for lower rates or
              even free services from major companies. Others because it is hard to find the free
              products needed though the massive amount of paid marketing by well-funded for profit
              companies.
            </p>
            <p>
              The Free for Charity services, consultant, and technology products directories seeks
              to fix this problem with our motto “Decisions should be made by metrics not
              marketing.”
            </p>
          </FrequentlyAskedQuestions>

          <FrequentlyAskedQuestions title="Where did the idea come from?">
            <p className="mb-[30px]">
              Free for charity was started when the founder first started as a board member on the
              local children’s museum’s board of directors. In just a few short weeks he
              uncovered many items the museum was paying for that were free to charities but the
              museum was paying for anyways.
            </p>
            <p className="mb-[30px]">
              In addition, for big projects the museum was not following any procurement management
              procedures at all. Items such as quoting from multiple vendors before a bid or cross
              leveling the bids for price and quality were not being done.
            </p>
            <p>
              Other issues found were the reliance on outdated technology because better
              alternatives were not known to the non IT trained staff.
            </p>
          </FrequentlyAskedQuestions>

          <FrequentlyAskedQuestions title="Why do charities pay for items they can get for free?">
            <p>
              The first reaction to uncovering these issues with the board was anger. The museum was
              losing or wasting thousands each year; money that could be used to keep admission
              prices lower and serve more children! After a deeper look it all came back to training
              and experience. Most charity founders and directors of small and medium charities are
              trained in the specialty of the charities mission, in this case child education and
              development. It is unreasonable to expect every charity director to be up to date on
              all procurement management methods and the technology that supports business and still
              run the day-to-day mission. This is where free for charity will come in to help your
              charities projects to thrive.
            </p>
          </FrequentlyAskedQuestions>

          <FrequentlyAskedQuestions title="Where does Free for Charity come in to help our charity or nonprofit?">
            <p className="mb-[30px]">
              Free for Charity will fill these vital roles for non profits and charities saving
              money for real program expenses. Most small to medium charities do not have the budget
              for full-time IT staff or business analysts like for profit companies and large
              charities. This is because grant managers and large donors want to see the lowest cost
              to “overhead” and don’t always look closely at the results that fall under program
              expenses.
            </p>
            <p className="mb-[30px]">
              Because of this common practice by large donors and grant institutions it is actually
              better for a small charity to waste money due to mismanagement such as by paying for
              something they could get for free because the item is put on the books as a ‘program
              expense’ and not questioned. Program expenses do not count against the charity like
              “overhead” does.
            </p>
            <p>
              Paying someone on the non program admin staff or the director of the charity to
              research and call companies for discounts is a labor cost that counts as “overhead”
              because it helps more than one program. With free for charity doing the work the
              target charity does not have to claim costs for overhead. Your nonprofit or charity
              group will gain access to professionals that have more expertise with the common
              business tasks like researching products to meet the charities needs. Free for Charity
              will also show you recommended technology and business practices that can save
              thousands each year.
            </p>
          </FrequentlyAskedQuestions>

          <FrequentlyAskedQuestions title="How can I tell if we have high overhead? / My charity does not have high overhead!">
            <p className="mb-[30px]">
              Free for Charity is all about efficiency. Many charities ‘fix’ this overhead problem
              by treating all staff as working on / in the programs or pro-rating between them all
              and hoping they will not get audited. While on paper you show very low overhead the
              functional effect is still the same. You have high paid staff like a director doing
              work that should be done by skilled volunteers or technology. Items such as your
              nonprofit or charity group bookkeeping data entry, or a full-time employee who updates
              the charity website or nonprofit Facebook page every now and then between front desk
              tasks.
            </p>
            <p className="mb-[30px]">
              If you have ever seen a charity with lower than 5% over head this is mostly what is
              going on. If you have low recorded overhead then your charity is most likely not using
              experts for tasks and all staff are wearing many hats; most of which they were never
              trained in.
            </p>
          </FrequentlyAskedQuestions>

          <FrequentlyAskedQuestions title="How do you provide your program services?">
            <p>
              We provide help for charities with efficiency. One element of efficiency is getting
              the best product at the lowest price. For charities and non profits much more labor
              can be provided for free by volunteers. Free for Charity does not make your full-time
              staff take on more and more roles we can fully take over many of these tasks with
              expert volunteer labor. Business and IT professionals are always seeking to advance
              their skills while helping out charities. We capture this labor pool (or create it
              with training programs) and then manage the volunteers for your charities tasks and
              projects. We can do this at extremely low if not zero cost because of economies of
              scale, and because most of this work is process or research based and does not have
              ‘hard’ costs like equipment.
            </p>
          </FrequentlyAskedQuestions>

          <FrequentlyAskedQuestions title="Are you like Idealist.org or other matching agencies?">
            <p className="mb-[30px]">
              Not exactly. That type of charity matches workers with charities but then leaves the
              management of the work to the individual nonprofit or charity group. Many small and
              medium charities do not have the time to manage a volunteer or group of volunteers.
              Even charities with a volunteer coordinator who works with entry-level volunteers may
              not have the skills to manage highly technical or high-level business volunteers such
              as those with MBA’s or decades in high-level information technology. This can result
              in your best volunteers leaving before a project is completed.
            </p>
            <p className="mb-[30px]">
              Free for Charity will manage both the work and the results of the projects in-house.
              All you have to do as a charity is to work with your project manager to set
              expectations and define results at each stage of the project.
            </p>
            <p className="mb-[30px]">
              We also provide many physical services like nonprofit websites and hosting that are
              functionally like a product to your charity. We manage all the functions in the
              background with volunteers. With these other sites you get one person assigned to work
              your web project and you have no management support once it is done unless that one
              person stays on as a volunteer permanently. With Free for Charity if your initial
              volunteer leaves another from the web team still works on your project and keeps your
              websites running and maintained. This is just one example.
            </p>
          </FrequentlyAskedQuestions>

          <FrequentlyAskedQuestions title="What do I need to get started?">
            <p>
              All you need to do to get free for charity to provide help for your charities
              mission today is to contact us with some basic information about your charity. We need
              to know what type of projects that you would like us to look at or undertake. Please
              fill out the form below and we will be in touch shortly.
            </p>
          </FrequentlyAskedQuestions>

          <FrequentlyAskedQuestions title="How can you afford to give away free domain names?">
            <p>
              As a 501(c)3 charity ourselves we seek individual, business, and grant sources of
              funding. At current, free for charity has not received a grant specifically for domain
              names or hosting but uses individual and business contributions to fund this program.
            </p>
          </FrequentlyAskedQuestions>

          <FrequentlyAskedQuestions title="Where do you get your domain name packages?">
            <p>
              We are a registered reseller of eNom domain names. eNom has graciously provided us
              with a Platinum account to support other non profits providing the lowest cost domain
              names for a charity of our size. As we get more and more charities into the domain
              system we expect the costs to freeforchariy.org to drop even further.
            </p>
          </FrequentlyAskedQuestions>

          <FrequentlyAskedQuestions title="Are you really a charity?">
            <p>
              Yes, We have had IRS designation since 2014 and have been building our systems and
              testing or support for several years. While charities for charities are rare they do
              exist and in fact fill an important need in reducing overhead expenses for other
              nonprofits. Our IRS designation number (EIN) is 46-2471893.  You can see our guidestar
              profile here. We are proud to also recommend other charities for charities that
              inspired us to create this nonprofit.
            </p>
          </FrequentlyAskedQuestions>

          <FrequentlyAskedQuestions title="Why do I not see hosting as an option?">
            <p className="mb-[20px]">
              We have a large backlog for new sites and support. We try to process at least 1 new
              charity into the full hosting system per week.
            </p>
            <p>
              <strong>Ways to get in faster:</strong>
              <br />
              1. If you already have your 501(c)3 get your free domain from us{' '}
              <a
                href="https://freeforcharity.org/domains"
                className="text-[#1c6e92] underline"
                target="_blank"
              >
                freeforcharity.org/domains
              </a>
              <br />
              2. If you can provide your own qualified WordPress webmaster you may be moved up in
              the list.
            </p>
          </FrequentlyAskedQuestions>

          <FrequentlyAskedQuestions title="If I am an individual or business and donate money for a domain package to Free for Charity, is this tax-deductible?">
            <p>
              While any official tax guidance should come from your accountant or other tax advisor
              Free For Charity is a registered 501(c)(3) organization and donations are
              tax-deductible. Our IRS designation number (EIN) is 46-2471893.  Upon checkout you
              will receive a receipt to provide to your accountant. Specifically, if you represent a
              business you can elect to deduct this as an expense versus as a donation depending on
              the guidance of your tax advisor.
            </p>
          </FrequentlyAskedQuestions>
        </div>
      </div>
    </div>
  )
}

export default index
