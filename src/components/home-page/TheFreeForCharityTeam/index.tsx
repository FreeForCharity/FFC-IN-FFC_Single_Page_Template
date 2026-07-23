import React from 'react'
import TeamMemberCard from '@/components/ui/TeamMemberCard'
import { configuredTeam } from '@/data/team'

// Team members are sourced from src/data/team/*.json (aggregated in
// src/data/team.ts). To change the team, edit those JSON files — no need to
// touch this component. Each card renders an initials monogram (no photos) and
// links to the member's LinkedIn when one is provided. The first three members
// render in the top row and the remaining members in a second row.
const index = () => {
  // Self-hide when no member is configured. `team` is a fixed list of JSON
  // imports, so a fork that blanks those files (rather than removing entries)
  // leaves team.length non-zero; configuredTeam keeps only members with a
  // populated name, so the section renders nothing instead of empty cards.
  if (configuredTeam.length === 0) return null

  const topRow = configuredTeam.slice(0, 3)
  const bottomRow = configuredTeam.slice(3)

  return (
    <div id="team" className="py-[50px]">
      <h2 className="font-[400] text-[40px] lg:text-[48px]  tracking-[0] text-center mx-auto mb-[50px] faustina-font">
        The Free For Charity Team
      </h2>

      <div className="w-[90%] mx-auto py-[40px]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  items-stretch justify-center mb-[50px] gap-[30px]">
          {topRow.map((member) => (
            <TeamMemberCard
              key={member.name}
              name={member.name}
              role={member.role}
              linkedinUrl={member.linkedinUrl}
            />
          ))}
        </div>
        {bottomRow.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 items-center justify-center mt-[40px] gap-[30px]">
            {bottomRow.map((member) => (
              <TeamMemberCard
                key={member.name}
                name={member.name}
                role={member.role}
                linkedinUrl={member.linkedinUrl}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default index
