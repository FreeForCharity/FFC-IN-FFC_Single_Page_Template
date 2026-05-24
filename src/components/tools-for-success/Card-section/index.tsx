import SlidingCard from '@/components/ui/SlidingCard'
import { assetPath } from '@/lib/assetPath'

export default function Page() {
  return (
    <div className="py-[54px] ">
      <div className="">
        <SlidingCard
          direction="left"
          subtitle="LastPass (free with paid premium version)"
          description={
            <>
              LastPass is a must have for absolutely everyone. Use this first before creating
              accounts with the other tools so you do it securely. We all know that we should use
              complex passwords and change them regularly but we don’t do it. Also we know that we
              should not use the same PW for every site we go to. Last pass solves both of these
              problems for FREE. NOTE: I use the paid version on my systems.
            </>
          }
          buttonText="Available Here"
          buttonLink="https://lastpass.com/friendwelcome.php?og=1&ref=47075402"
          imageSrc={assetPath('/Images/LastPass-Logo-Color.webp')}
        />
        <SlidingCard
          direction="left"
          subtitle="Mint (free ad supported)"
          description={
            <>
              Mint is a FREE tool that allows you to truly see how you earn and spend money. It runs
              in the background of your life and gets better and better over time especially after 3
              years. I have used mint for years and the insights that it provides helps in creating
              conscious spending and catching bank problems before they get out of hand.
            </>
          }
          buttonText="Available Here"
          buttonLink="mint.com"
          imageSrc={assetPath('/Images/mint-logo.webp')} // 👈 image passed as prop
        />
      </div>
    </div>
  )
}
