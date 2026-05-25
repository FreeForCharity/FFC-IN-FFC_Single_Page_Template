import StepsCard from '@/components/ui/StepContentCard'
import Image from 'next/image'
import { assetPath } from '@/lib/assetPath'

export default function CloudflareSetup() {
  return (
    <div className="pt-[20px]">
      <StepsCard title="Follow the following steps" id="orderstep1">
        <ol
          className="list-decimal list-inside text-left text-[20px] leading-[26px] font-[500]"
          id="raleway-font"
        >
          <li>
            Use your organizational outlook.com account
            <br />
            e.g.{' '}
            <a href="mailto:yourcharity@outlook.com" className="text-[#2ea3f2]">
              yourcharity@outlook.com
            </a>
          </li>
          <li>
            Sign up at CloudFlare
            <br />
            <a
              href="https://dash.cloudflare.com/sign-up"
              target="_blank"
              rel="noopener"
              className="text-[#2ea3f2] break-all"
            >
              https://dash.cloudflare.com/sign-up
            </a>
            For Help (
            <a
              href="https://developers.cloudflare.com/fundamentals/account/#:~:text=Add%20a%20domain%20to%20Cloudflare%201%20Log%20in,on%20Cloudflare%2C%20change%20your%20domain%20nameservers%20to%20Cloudflare"
              target="_blank"
              rel="noopener"
              className="text-blue-600 underline hover:text-blue-800 text-[20px]"
            >
              CloudFlare Setup Help
            </a>
            <span className="text-[20px]">)</span>
          </li>
          <li>Leave the tab open when you buy your domain name</li>
        </ol>
      </StepsCard>

      <StepsCard title="Follow the following steps" id="orderstep3">
        {/* Bullet List */}
        <ul className="list-disc list-inside" id="raleway-font">
          <li>
            Select only a .org domain
            <ol className="list-lower-roman list-inside ml-6">
              <li>i. Follow all steps for the checkout</li>
              <li>
                ii. Do not forget to put in the coupon code found in the email you received from the
                FFC Onboarding Acceptance or it will charge you money. This is required to stop spam
                purchases and to ensure only charities use the service
              </li>
            </ol>
          </li>

          <li>
            NOTE: You must include payment method as this is a commercial system and even with a $0
            invoice it will not run each year if it does not see payment. We recommend Paypal and
            ACH as these are the most stable.
          </li>

          <li>
            <strong>
              NOTE: If you have a domain already with another domain registrar (e.g. godaddy, enom){' '}
              <span className="underline">
                we do not recommend that you move your domain name without calling us first.
              </span>{' '}
              In either case make sure it is already verified in your Cloudflare account{' '}
            </strong>
          </li>

          <li>
            NOTE: As soon as you complete the purchase you will be brought into the account area.{' '}
            <strong>
              It is very important that you create an additional user in the users tab.{' '}
            </strong>{' '}
            We require at least 2 points for contact for a domain name and to support recovery for
            your charity.
            <ol className="list-lower-roman list-inside">
              <li>i. Check your junk mail and spam boxes for all notices and mark as not spam</li>
            </ol>
          </li>
        </ul>

        {/* Screenshot Image – You can change the src */}
        <div className="mt-10 mb-[34px] -mx-10 md:-mx-15">
          <Image
            src={assetPath('/Images/Card-section-1.webp')} // Change this path
            alt="User Management - Invite New User"
            width={1200}
            height={800}
            className="w-full rounded-lg shadow-md"
          />
        </div>
      </StepsCard>

      <StepsCard title="Change your DNS to point to Cloudflare" id="orderstep4">
        <div className="mt-10 mb-[34px] -mx-10 md:-mx-15">
          <Image
            src={assetPath('/Images/Card-section-2.webp')} // Change this path
            alt="User Management - Invite New User"
            width={1200}
            height={800}
            className="w-full"
          />
        </div>
        <div className="mt-10 mb-[34px] -mx-10 md:-mx-15">
          <Image
            src={assetPath('/Images/Card-section-3.webp')} // Change this path
            alt="User Management - Invite New User"
            width={1200}
            height={800}
            className="w-full"
          />
        </div>
        <div className="mt-10 mb-[34px] -mx-10 md:-mx-15">
          <Image
            src={assetPath('/Images/Card-section-4.webp')} // Change this path
            alt="User Management - Invite New User"
            width={1200}
            height={800}
            className="w-full"
          />
        </div>
        <div className="mt-10 mb-[34px] -mx-10 md:-mx-15">
          <Image
            src={assetPath('/Images/Card-section-5.webp')} // Change this path
            alt="User Management - Invite New User"
            width={1200}
            height={800}
            className="w-full"
          />
        </div>
      </StepsCard>
    </div>
  )
}
