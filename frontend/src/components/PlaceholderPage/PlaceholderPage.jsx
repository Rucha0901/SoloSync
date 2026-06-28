import Logo from "../Logo/Logo";
import "./PlaceholderPage.css";

export default function PlaceholderPage({ title, description }) {
  return (
    <section className="placeholder-page">
      <div className="placeholder-page__brand" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem', justifyContent: 'center' }}>
        <Logo size={32} />
        <span className="placeholder-page__eyebrow">SoloSync</span>
      </div>
      <h1 className="placeholder-page__title">{title}</h1>
      <p className="placeholder-page__description">{description}</p>
    </section>
  );
}
