import "./PlaceholderPage.css";

export default function PlaceholderPage({ title, description }) {
  return (
    <section className="placeholder-page">
      <span className="placeholder-page__eyebrow">FreelanceFlow</span>
      <h1 className="placeholder-page__title">{title}</h1>
      <p className="placeholder-page__description">{description}</p>
    </section>
  );
}
