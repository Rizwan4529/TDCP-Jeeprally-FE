import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FiChevronDown } from "react-icons/fi";
import { useParams, useSearchParams } from "react-router";
import raceBg from "../../../assets/images/race-bg.jpg";
import {
  fetchRallyChampions,
  resolveCheckpointImageUrl,
} from "../../../api/features/rally/rally.service.jsx";
import { activeRallyQueryOptions } from "../../../api/features/rally/rally.queryOptions.jsx";
import { useCategoriesQuery } from "../../../api/features/content/hooks.jsx";
import {
  getDefaultCategoryKey,
  hasCategoryKey,
} from "../../../utils/constants.js";
import {
  STATIC_CHAMPION_PROFILES,
  STATIC_OTHER_RACES,
  STATIC_TEAM_STANDING,
} from "../playerProfile.data.js";
import { buildPlayerProfile } from "../playerProfile.utils.js";

const BADGE_ICON = (
  <svg
    className="h-3.5 w-3.5"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden
  >
    <path d="M12 2l2.3 4.66L19.5 7.4l-3.75 3.65.88 5.15L12 13.7l-4.63 2.5.88-5.15L4.5 7.4l5.2-.74L12 2z" />
  </svg>
);

const InfoRow = ({ label, value }) => (
  <div className="grid grid-cols-[minmax(110px,180px)_1fr] items-center gap-6 py-2.5">
    <span className="text-[12px] font-semibold uppercase tracking-[0.04em] text-[#222]">
      {label}
    </span>
    <span className="text-right text-[14px] text-[#4B4B4B]">{value}</span>
  </div>
);

const Badge = ({ children }) => (
  <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E7E7E7] bg-white px-3 py-1 text-[10px] font-medium text-[#5E5E5E] shadow-[0_2px_6px_rgba(0,0,0,0.04)]">
    {BADGE_ICON}
    {children}
  </span>
);

const StandingPanel = ({
  title,
  headerClassName,
  items,
  expandedIndex,
  onToggle,
  renderExpanded,
  striped = false,
}) => (
  <div className="overflow-hidden rounded-[4px] border border-[#ECECEC] bg-white shadow-[0_8px_20px_rgba(0,0,0,0.04)]">
    <div className={`px-6 py-4 ${headerClassName}`}>
      <h3 className="font-gilda text-[17px] text-white">{title}</h3>
    </div>
    <div>
      {items.map((item, idx) => {
        const isOpen = expandedIndex === idx;
        return (
          <div
            key={`${item.year}-${idx}`}
            className="border-t border-[#ECECEC] first:border-t-0"
          >
            <button
              type="button"
              className={`flex w-full items-center justify-between px-6 py-4 text-left transition-colors ${
                striped && idx % 2 === 1 ? "bg-[#F6F6F6]" : "bg-white"
              } hover:bg-[#FAFAFA]`}
              onClick={() => onToggle(isOpen ? null : idx)}
            >
              <span className="font-sans text-[36px] font-semibold italic leading-none text-[#1E1E1E]">
                {item.year}
              </span>
              <div className="flex items-center gap-2">
                <Badge>{item.stage}</Badge>
                <span className="inline-flex h-8 min-w-8 items-center justify-center rounded-full border border-[#E7E7E7] bg-white px-2 text-[11px] font-semibold text-[#444]">
                  {item.rank}
                </span>
                <FiChevronDown
                  className={`text-[#7C7C7C] transition-transform duration-300 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </div>
            </button>
            {isOpen ? renderExpanded(item) : null}
          </div>
        );
      })}
    </div>
  </div>
);

const ProfileRoleCard = ({ label, image, isActive, onClick }) => (
  <button
    type="button"
    className="group relative text-center"
    onClick={onClick}
  >
    <div
      className={`overflow-hidden rounded-[6px] bg-[#43515C] shadow-[0_8px_18px_rgba(0,0,0,0.10)] transition-all duration-300 ${
        isActive
          ? "border-[4px] border-primary"
          : "border-[4px] border-transparent opacity-95"
      }`}
    >
      <img
        src={image}
        alt={label}
        className="h-[176px] w-[160px] object-cover object-top md:h-[176px] md:w-[180px]"
      />
    </div>
    <div
      className={`relative mx-auto -mt-5 w-fit min-w-[128px] rounded-[4px] px-6 py-2 shadow-[0_8px_18px_rgba(0,0,0,0.14)] ${
        isActive ? "bg-primary text-white" : "bg-[#333333] text-white"
      }`}
    >
      <span className="font-gilda text-[20px]">{label}</span>
      {isActive ? (
        <span className="absolute left-1/2 top-full -translate-x-1/2 border-l-[10px] border-r-[10px] border-t-[12px] border-l-transparent border-r-transparent border-t-primary" />
      ) : null}
    </div>
  </button>
);

const PlayerProfile = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState("driver");
  const [expandedTeamStanding, setExpandedTeamStanding] = useState(0);
  const [expandedOtherRaces, setExpandedOtherRaces] = useState(0);
  const { data: activeEvent } = useQuery(activeRallyQueryOptions);
  const { data: categoriesRaw = [] } = useCategoriesQuery();
  const eventId = activeEvent?._id;
  const requestedCategory = searchParams.get("category") || "";
  const activeCategoryKey = useMemo(() => {
    if (hasCategoryKey(categoriesRaw, requestedCategory)) {
      return requestedCategory;
    }
    return getDefaultCategoryKey(categoriesRaw);
  }, [categoriesRaw, requestedCategory]);

  const fallbackProfile = useMemo(
    () =>
      STATIC_CHAMPION_PROFILES.find((item) => item.id === id) ||
      STATIC_CHAMPION_PROFILES[0],
    [id],
  );
  const { data: championsRaw = [] } = useQuery({
    queryKey: [
      "rally",
      "champions",
      "player-profile",
      eventId,
      activeCategoryKey,
    ],
    queryFn: () => fetchRallyChampions(eventId, activeCategoryKey),
    enabled: Boolean(eventId && activeCategoryKey),
    refetchOnWindowFocus: false,
  });

  const champion = useMemo(
    () => championsRaw.find((item) => item._id === id) || null,
    [championsRaw, id],
  );
  const profile = useMemo(
    () => buildPlayerProfile(champion, fallbackProfile),
    [champion, fallbackProfile],
  );

  const heroImage = resolveCheckpointImageUrl(profile.heroImage);
  const driverImage = resolveCheckpointImageUrl(profile.driverImage);
  const navigatorImage = resolveCheckpointImageUrl(profile.navigatorImage);

  return (
    <div className="mt-[50px] min-h-screen bg-white">
      <section className="relative h-[360px] z-20 md:h-[420px] lg:h-[470px] ">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${raceBg})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/0 via-white/0 to-white/10" />

        <div className="absolute inset-x-0 bottom-0 z-10 flex justify-center">
          <img
            src={heroImage}
            alt={profile.driverName}
            className="h-[300px] object-contain object-bottom"
          />
        </div>

        <div className="absolute bottom-0 left-1/2 z-40 w-[min(90vw,360px)] -translate-x-1/2 translate-y-1/2 rounded-[4px] border border-[#ECECEC] bg-white px-6 py-5 text-center shadow-[0_12px_28px_rgba(0,0,0,0.10)]">
          <p className="font-sans text-[20px] leading-none text-[#111]">
            {profile.number}
          </p>
          <p className="mt-2 font-gilda text-[18px] leading-[1.25] text-[#2E2E2E]">
            {profile.teamName}
          </p>
        </div>
      </section>

      <section className="container relative z-0 mx-auto px-4 pb-20 pt-28 md:pt-32">
        <div className="mx-auto flex max-w-[460px] items-end justify-center gap-5 md:gap-8">
          <ProfileRoleCard
            label="Driver"
            image={driverImage}
            isActive={activeTab === "driver"}
            onClick={() => setActiveTab("driver")}
          />
          <ProfileRoleCard
            label="Navigator"
            image={navigatorImage}
            isActive={activeTab === "navigator"}
            onClick={() => setActiveTab("navigator")}
          />
        </div>

        <div className="mx-auto mt-12 max-w-[470px] rounded-[4px] border border-[#EFEFEF] bg-white px-5 py-6 shadow-[0_10px_24px_rgba(0,0,0,0.07)] md:px-6">
          <h2 className="font-gilda text-[27px] leading-none text-[#212121]">
            {profile.driverName}
          </h2>
          <div className="mt-6 divide-y divide-[#F1F1F1]">
            {profile.details.map((item) => (
              <InfoRow key={item.label} label={item.label} value={item.value} />
            ))}
          </div>
        </div>

        <div className="mx-auto mt-14 grid max-w-[1020px] gap-6 lg:grid-cols-2">
          <StandingPanel
            title="Team Standing"
            headerClassName="bg-primary"
            items={STATIC_TEAM_STANDING}
            expandedIndex={expandedTeamStanding}
            onToggle={setExpandedTeamStanding}
            renderExpanded={(item) => (
              <div className="flex flex-wrap gap-3 bg-[#FBFBFB] px-6 py-4">
                <Badge>Role : {item.role}</Badge>
                <Badge>Cat : {item.category}</Badge>
                <Badge>Team : {item.team}</Badge>
              </div>
            )}
          />

          <StandingPanel
            title="Other Races"
            headerClassName="bg-[#333333]"
            items={STATIC_OTHER_RACES}
            expandedIndex={expandedOtherRaces}
            onToggle={setExpandedOtherRaces}
            striped={true}
            renderExpanded={(item) => (
              <div className="flex flex-wrap gap-3 bg-[#FBFBFB] px-6 py-4">
                <Badge>Event : {item.event}</Badge>
                <Badge>Vehicle : {item.vehicle}</Badge>
              </div>
            )}
          />
        </div>
      </section>
    </div>
  );
};

export default PlayerProfile;
